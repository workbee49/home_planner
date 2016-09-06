import Three from 'three';
import MTLLoader from './libs/MTLLoader';
import OBJLoader from './libs/OBJLoader';

export function createDoor(width, height, thickness, x, y, z, pixelPerUnit, isSelected) {

  let doorColor = new Three.Color(1, 1, 1);
  if (isSelected) {
    doorColor = new Three.Color(1, 0.76, 0);
  }

  let frame1_width = 0.1 * pixelPerUnit;
  let frame2_height = 0.1 * pixelPerUnit;

  /* Definisco il telaio della porta con la relativa texture */

  var frame1Geom = new Three.BoxGeometry(frame1_width, height, thickness + 0.05 * pixelPerUnit);
  var frame2Geom = new Three.BoxGeometry(width - 2 * frame1_width, frame2_height, thickness + 0.05 * pixelPerUnit);

  var textureFrameImage = require('./textures/door/frame-door.jpg');

  frame1Geom.computeVertexNormals();

  let textureLoader = new Three.TextureLoader();
  let texture = textureLoader.load(textureFrameImage);
  let frameMaterial = new Three.MeshPhongMaterial();
  frameMaterial.map = texture;
  frameMaterial.color = doorColor;


  let frame1 = new Three.Mesh(frame1Geom, frameMaterial);
  let frame2 = new Three.Mesh(frame2Geom, frameMaterial);
  let frame3 = new Three.Mesh(frame1Geom, frameMaterial);

  let doorGeometry = new Three.BoxGeometry(width - frame1_width * 2, height, thickness);

  /* Creation of the central part of the door */
  let imageFile = require('./textures/door/main-door.jpg');
  let imageFile2 = require('./textures/door/main-door2.jpg');

  doorGeometry.computeVertexNormals();

  let textureDoor = textureLoader.load(imageFile);
  let doorMaterial1 = new Three.MeshPhongMaterial();
  doorMaterial1.map = textureDoor;
  doorMaterial1.normalScale.set(3, 3);
  doorMaterial1.color = doorColor;

  let textureDoor2 = textureLoader.load(imageFile2);
  let doorMaterial2 = new Three.MeshPhongMaterial();
  doorMaterial2.map = textureDoor2;
  doorMaterial2.normalScale.set(3, 3);
  doorMaterial2.color = doorColor;

  /* Use a face material for the door (so we can define a back texture) */

  let mats = [];
  mats.push(frameMaterial);
  mats.push(frameMaterial);
  mats.push(frameMaterial);
  mats.push(frameMaterial);
  mats.push(doorMaterial1);
  mats.push(doorMaterial2);

  let faceMaterial = new Three.MeshFaceMaterial(mats);

  let door = new Three.Mesh(doorGeometry, faceMaterial);

  door.geometry.computeFaceNormals();

  let object = new Three.Object3D();
  object.add(frame1);
  object.add(frame2);
  object.add(frame3);
  object.add(door);

  object.position.x = x;
  object.position.y = y;
  object.position.z = z;

  frame1.position.x -= width / 2 - frame1_width / 2;
  frame2.position.y += height / 2 - frame2_height / 2;
  frame3.position.x += width / 2 - frame1_width / 2;

  return object;


}

export function createDoorFromObj(width, height, thickness, isSelected) {


  let mtlLoader = new MTLLoader();
  mtlLoader.setPath('obj/door-generic/');
  let url = "door.mtl";
  return new Promise((resolve, reject) => {

    mtlLoader.load(url, materials => {
      materials.preload();
      let objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('obj/door-generic/');
      objLoader.load('door.obj', object => {

        let boundingBox = new Three.Box3().setFromObject(object);

        let initialWidth = boundingBox.max.x - boundingBox.min.x;
        let initialHeight = boundingBox.max.y - boundingBox.min.y;
        let initialThickness = boundingBox.max.z - boundingBox.min.z;

        if (isSelected) {
          let box = new Three.BoxHelper(object, 0xffc107);
          object.add(box);
        }

        object.scale.set(width / initialWidth, height / initialHeight, thickness / initialThickness);

        resolve(object);
      });

    });
  });
}
