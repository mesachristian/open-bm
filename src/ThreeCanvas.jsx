import { useState, useCallback } from 'react';
import * as THREE from 'three';
import * as OBC from 'openbim-components';

const initOBC = async (node, file) => {
    console.log("initOBC", file);
    const components = new OBC.Components();
    components.scene = new OBC.SimpleScene(components);
    components.renderer = new OBC.SimpleRenderer(components, node);
    components.camera = new OBC.SimpleCamera(components);
    components.raycaster = new OBC.SimpleRaycaster(components);

    components.init();

    const scene = components.scene.get();

    components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

    const grid = new OBC.SimpleGrid(components);

    //const toolbar = new OBC.Toolbar(components);
    //components.ui.addToolbar(toolbar);
    //toolbar.addChild(fragments.uiElement.get("main"));

    let fragments = new OBC.FragmentManager(components);
    let fragmentIfcLoader = new OBC.FragmentIfcLoader(components);
    fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

    //fragmentIfcLoader.settings.webIfc.TAPE_SIZE = 0;
    fragmentIfcLoader.settings.wasm = {
        path: "https://unpkg.com/web-ifc@0.0.43/",
        absolute: true
    }

    //const file = await fetch('https://www.steptools.com/docs/stpfiles/ifc/AC20-Institute-Var-2.ifc');
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await fragmentIfcLoader.load(buffer);
    scene.add(model);

    /*const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
    const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    cube.position.set(0, 1.5, 0);
    scene.add(cube);*/

    components.scene.setup();
}

function disposeFragments(fragments) {
    fragments.dispose();
}

const ThreeCanvas = (props) => {

    const [initialized, setInitialized] = useState(false);

    const threeDivRef = useCallback(
        (node) => {
            if (node !== null && !initialized) {
                initOBC(node, props.model)
                setInitialized(true)
            }
        },
        [initialized]
    )

    return (
        <div
            style={{
                height: '500px',
                width: '800px'
            }}
            ref={threeDivRef}
        ></div>
    );
}

export default ThreeCanvas;