import { useState, useCallback } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

async function loadIfcAsFragments() {
    const file = await fetch('../../../resources/small.ifc');
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer, "example");
    scene.add(model);
}

const initOBC = async (node) => {
    const components = new OBC.Components();
    components.scene = new OBC.SimpleScene(components);
    components.renderer = new OBC.SimpleRenderer(components, node);
    components.camera = new OBC.SimpleCamera(components);
    components.raycaster = new OBC.SimpleRaycaster(components);

    components.init();

    let fragments = new OBC.FragmentManager(components);
    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);

    const scene = components.scene.get();
    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    //const grid = new OBC.SimpleGrid(components);
    const simpleGrid = await components.tools.get(OBC.SimpleGrid);

    const mainToolbar = new OBC.Toolbar(components);
    mainToolbar.name = "Main toolbar";
    components.ui.addToolbar(mainToolbar);

    const alertButton = new OBC.Button(components);
    alertButton.materialIcon = "info";
    alertButton.tooltip = "Information";
    mainToolbar.addChild(alertButton);
    alertButton.onClick.add(() => {
        alert('I\'ve been clicked!');
    });

    const ifcButton = fragmentIfcLoader.uiElement.get("main");
    mainToolbar.addChild(ifcButton);

    fragmentIfcLoader.settings.wasm = {
        path: "https://unpkg.com/web-ifc@0.0.46/",
        absolute: true
    }

    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    // CUBE
    const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.position.set(0, 1.5, 0);
    scene.add(cube);

    // light
    components.scene.setup();
}

const NewCanvas = () => {

    const [initialized, setInitialized] = useState(false);

    const threeDivRef = useCallback(
        (node) => {
            if (node !== null && !initialized) {
                initOBC(node);
                setInitialized(true)
            }
        },
        [initialized]
    );

    return (
        <div style={{
            height: '500px',
            width: '800px'
        }} ref={threeDivRef} />
    );
}

export default NewCanvas;