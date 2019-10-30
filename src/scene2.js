import React from "react";
import Matter from "matter-js";

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Composites = Matter.Composites,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
      world = engine.world;
      engine.world.gravity.y = 0;
    // create renderer
    var render = Render.create({
      element: this.refs.scene,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies

    var ballA = Bodies.circle(210, 100, 30, { restitution: 1 });

    var size = 50;

    var stack = Composites.stack(100, 290, 6, 6, 0, 0, function(x, y) {
      var partA = Bodies.rectangle(x, y, size, size/5),
        partB = Bodies.circle(x, y, size / 4, {
          render: partA.render
        });

      return Body.create({
        parts: [partA, partB]
      });
    });

    World.add(world, [
      stack,
      // walls
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(400, 609, 800, 50, { isStatic: true }),
      ballA
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false
          }
        }
      });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
    });
  }

  render() {
    return <div ref="scene" />;
  }
}
export default Scene;
