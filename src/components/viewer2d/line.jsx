import React, {PropTypes} from 'react';
import {distanceFromTwoPoints, angleBetweenTwoPointsAndOrigin} from '../../utils/geometry';

export default function Line({line, layer}, {editingActions, sceneComponents}) {

  let vertex0 = layer.vertices.get(line.vertices.get(0));
  let vertex1 = layer.vertices.get(line.vertices.get(1));

  if (vertex0.id === vertex1.id) return null; //avoid 0-length lines

  let x1, y1, x2, y2;
  if (vertex0.x <= vertex1.x) {
    ({x: x1, y: y1} = vertex0);
    ({x: x2, y: y2} = vertex1);
  } else {
    ({x: x1, y: y1} = vertex1);
    ({x: x2, y: y2} = vertex0);
  }

  let length = distanceFromTwoPoints(x1, y1, x2, y2);
  let angle = angleBetweenTwoPointsAndOrigin(x1, y1, x2, y2);

  let renderedHoles = line.holes.map(holeID => {
    let hole = layer.holes.get(holeID);
    let onHoleClick = event => {
      editingActions.selectHole(layer.id, hole.id);
      event.stopPropagation();
    };

    let startAt = length * hole.offset - hole.properties.get('width') / 2;
    let renderedHole = sceneComponents[hole.type].render2D(hole, layer);

    return (<g key={holeID} transform={`translate(${startAt}, 0)`} onClick={onHoleClick}> {renderedHole} </g>);
  });


  let onLineClick = event => {
    editingActions.selectLine(layer.id, line.id);
    event.stopPropagation();
  };

  let renderedLine = sceneComponents[line.type].render2D(line, layer);

  return (
    <g transform={`translate(${x1}, ${y1}) rotate(${angle}, 0, 0)`} onClick={onLineClick}>
      {renderedLine}
      {renderedHoles}
    </g>
  );

}

Line.propTypes = {
  line: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired
};

Line.contextTypes = {
  editingActions: PropTypes.object,
  sceneComponents: React.PropTypes.object
};
