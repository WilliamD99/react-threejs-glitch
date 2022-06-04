import "./styles.css";
import * as THREE from "three";
import React, { useEffect } from "react";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";

export default function App() {
  function cover(texture, aspect) {
    var imageAspect = texture.image.width / texture.image.height;
    if (aspect < imageAspect) {
      texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
    } else {
      texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
    }
  }
  useEffect(() => {
    const stage = document.querySelector("#stage");

    let scene = new THREE.Scene();
    let renderer = new THREE.WebGLRenderer({
      canvas: stage,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / 800))) / Math.PI;
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.set(0, 0, 800);

    let texture = new THREE.TextureLoader().load(
      "https://picsum.photos/seed/picsum/200/300",
      () => {
        cover(texture, window.innerWidth / window.innerHeight);
        scene.background = texture;
      }
    );

    let composer = new EffectComposer(renderer);
    let renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    let glitchPass = new GlitchPass();
    composer.addPass(glitchPass);

    function render() {
      // if (renderer === undefined) return;
      requestAnimationFrame(render);

      composer.render();
    }
    render();
  }, []);
  return (
    <>
      <canvas
        id="stage"
        style={{ height: "30vh", width: "30vw", zIndex: 1000 }}
      ></canvas>
    </>
  );
}
