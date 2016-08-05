import Three from 'three';

export default function createArea(vertices, color, textureName) {

  let shape = new Three.Shape();
  shape.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    shape.lineTo(vertices[i].x, vertices[i].y);
  }

  if (textureName && textureName !== 'none') {
    color = 0xffffff;
  }

  let areaMaterial = new Three.MeshPhongMaterial({
    side: Three.DoubleSide,
    color: color
  });

  switch (textureName) {
    case 'parquet':
      areaMaterial.map = Three.ImageUtils.loadTexture('./libs/textures/parquet.jpg');
      areaMaterial.needsUpdate = true;
      areaMaterial.map.wrapS = Three.RepeatWrapping;
      areaMaterial.map.wrapT = Three.RepeatWrapping;
      areaMaterial.map.repeat.set(.01, .01);
      break;
    case 'none':
    default:
  }

  let area = new Three.Mesh(new Three.ShapeGeometry(shape), areaMaterial);

  area.rotation.x -= Math.PI / 2;
  return area;
}
