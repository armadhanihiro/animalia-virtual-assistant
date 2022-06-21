from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional

import cv2
import numpy as np

import torch
import base64
import random
from fastapi.responses import RedirectResponse

app = FastAPI()
colors = [tuple([random.randint(0, 255) for _ in range(3)]) for _ in range(100)] #for bbox plotting


model_selection_options = ['yolov5s','yolov5m','yolov5l','yolov5x']
model_dict = {model_name: None for model_name in model_selection_options} #set up model cache


@app.get("/")
def home(request: Request):
	return RedirectResponse(url='/docs')


@app.post("/detect/")
async def detect_via_api(request: Request,
						file_list: List[UploadFile] = File(...)):
	img_size = 640
	download_image = True
	model_name = 'yolov5s'
	if model_dict[model_name] is None:
		model_dict[model_name] = torch.hub.load('ultralytics/yolov5', 'custom', path='tesava1.pt', force_reload=True) 
	
	img_batch = [cv2.imdecode(np.fromstring(await file.read(), np.uint8), cv2.IMREAD_COLOR)
					for file in file_list]

	#create a copy that corrects for cv2.imdecode generating BGR images instead of RGB, 
	#using cvtColor instead of [...,::-1] to keep array contiguous in RAM
	img_batch_rgb = [cv2.cvtColor(img, cv2.COLOR_BGR2RGB) for img in img_batch]
	
	results = model_dict[model_name](img_batch_rgb, size = img_size) 
	json_results = results_to_json(results,model_dict[model_name])

	if download_image:
		for idx, (img, bbox_list) in enumerate(zip(img_batch, json_results)):
			for bbox in bbox_list:
				label = f'{bbox["class_name"]} {bbox["confidence"]:.2f}'
				plot_one_box(bbox['bbox'], img, label=label, 
						color=colors[int(bbox['class'])], line_thickness=3)

			payload = {'image_base64':base64EncodeImage(img)}
			json_results[idx].append(payload)

	return json_results
	


def results_to_json(results, model):
	''' Converts yolo model output to json (list of list of dicts)'''
	return [
				[
					{
					"class": int(pred[5]),
					"class_name": model.model.names[int(pred[5])],
					"bbox": [int(x) for x in pred[:4].tolist()], #convert bbox results to int from float
					"confidence": float(pred[4]),
					}
				for pred in result
				]
			for result in results.xyxy
			]


def plot_one_box(x, im, color=(128, 128, 128), label=None, line_thickness=3):
	# Directly copied from: https://github.com/ultralytics/yolov5/blob/cd540d8625bba8a05329ede3522046ee53eb349d/utils/plots.py
    # Plots one bounding box on image 'im' using OpenCV
    assert im.data.contiguous, 'Image not contiguous. Apply np.ascontiguousarray(im) to plot_on_box() input image.'
    tl = line_thickness or round(0.002 * (im.shape[0] + im.shape[1]) / 2) + 1  # line/font thickness
    c1, c2 = (int(x[0]), int(x[1])), (int(x[2]), int(x[3]))
    cv2.rectangle(im, c1, c2, color, thickness=tl, lineType=cv2.LINE_AA)
    if label:
        tf = max(tl - 1, 1)  # font thickness
        t_size = cv2.getTextSize(label, 0, fontScale=tl / 3, thickness=tf)[0]
        c2 = c1[0] + t_size[0], c1[1] - t_size[1] - 3
        cv2.rectangle(im, c1, c2, color, -1, cv2.LINE_AA)  # filled
        cv2.putText(im, label, (c1[0], c1[1] - 2), 0, tl / 3, [225, 255, 255], thickness=tf, lineType=cv2.LINE_AA)


def base64EncodeImage(img):
	''' Takes an input image and returns a base64 encoded string representation of that image (jpg format)'''
	_, im_arr = cv2.imencode('.jpg', img)
	im_b64 = base64.b64encode(im_arr.tobytes()).decode('utf-8')

	return im_b64

if __name__ == '__main__':
	import uvicorn
	import argparse
	parser = argparse.ArgumentParser()
	parser.add_argument('--host', default = 'localhost')
	parser.add_argument('--port', default = 8000)
	parser.add_argument('--precache-models', action='store_true', help='Pre-cache all models in memory upon initialization, otherwise dynamically caches models')
	opt = parser.parse_args()

	if opt.precache_models:
		model_dict = {model_name: torch.hub.load('ultralytics/yolov5', 'custom', path='tesava.pt', force_reload=True)}
	
	app_str = 'server:app' #make the app string equal to whatever the name of this file is
	uvicorn.run(app_str, host= opt.host, port=opt.port, reload=True)
