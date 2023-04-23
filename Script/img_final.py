import cv2
import numpy as np
import json
import sys
import base64
import ast

pathname = sys.argv[1]
obj_str = sys.argv[2]
obj = json.loads(obj_str)
# print(repr(obj_str));




imc = cv2.imread('./uploads/' + pathname)
img = imc.copy()

[xSize, ySize , d] = img.shape

# R_level = -9 
R_level = -9 if obj["selectedValue"] == 1 else obj["redSlider"]
G_level = 75 if obj["selectedValue"] == 1 else obj["greenSlider"]
B_level = 0 if obj["selectedValue"] == 1 else obj["blueSlider"]
# G_level = 75
# B_level = 100

img = imc.copy()
np.add(img[:, :, 0], -B_level,out=img[:, :, 0], casting="unsafe")
np.add(img[:, :, 1], -G_level,out=img[:, :, 1], casting="unsafe")
np.add(img[:, :, 2], -R_level,out=img[:, :, 2], casting="unsafe")

if obj["selectedValue"] == 1:
    img = imc.copy()

img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
(h, s, v) = cv2.split(img_hsv);
s = s*2 if obj['selectedValue'] == 1 else s*1
s = np.clip(s,0,255)
img_hsv = cv2.merge([h,s,v])
img = cv2.cvtColor(img_hsv.astype("uint8"), cv2.COLOR_HSV2BGR)
# cv2.imwrite(f'./uploads/{pathname}-updated.jpg',img)
# obj = {}
# obj['path'] = '/uploads/' + pathname + '-updated.jpg'
# print(json.dumps(obj))
ret, jpeg = cv2.imencode('.jpg', img);

sys.stdout.buffer.write(jpeg.tobytes())