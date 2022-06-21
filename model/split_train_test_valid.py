import shutil, os, random, math, numpy as np

def split_train_test(test_ratio=0.15,dir='static/img',destination='train'):
    PATH_DESTINATION = os.path.join('dataset',destination)
    PATH_DESTINATION_TEST = os.path.join('dataset','test')
    PATH_DIR = dir
    if not os.path.exists(PATH_DESTINATION):
        os.mkdir(PATH_DESTINATION)
    else:
        pass
    for name in os.listdir(dir):
        PATH_DESTINATION_ANIMAL = os.path.join(PATH_DESTINATION,name)
        PATH_DESTINATION_ANIMAL_TEST = os.path.join(PATH_DESTINATION_TEST,name)
        if not os.path.exists(PATH_DESTINATION_ANIMAL_TEST):
            os.mkdir(PATH_DESTINATION_ANIMAL_TEST)
        if not os.path.exists(PATH_DESTINATION_ANIMAL):
            os.mkdir(PATH_DESTINATION_ANIMAL)
        PATH_ANIMAL = os.path.join(PATH_DIR,name)
        jmlh_test = math.ceil(len((os.listdir(PATH_ANIMAL)))*test_ratio)
        jmlh_train = math.ceil(len((os.listdir(PATH_ANIMAL))) - jmlh_test)
        for i in range(jmlh_train):
            src = os.path.join(PATH_ANIMAL,random.choice(os.listdir(PATH_ANIMAL)))
            shutil.move(src,PATH_DESTINATION_ANIMAL)
        for j in range(len((os.listdir(PATH_ANIMAL)))):
            src_test = os.path.join(PATH_ANIMAL,random.choice(os.listdir(PATH_ANIMAL)))
            shutil.move(src_test,PATH_DESTINATION_ANIMAL_TEST)
        
split_train_test()