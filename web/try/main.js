import {
    Scene,
    MeshBasicMaterial,
    Mesh,
    WebGLRenderer,
    PerspectiveCamera,
    Group,
    AxesHelper,
    TextureLoader,
    PlaneGeometry,
    Quaternion,
    Vector3,
    LinearFilter,
} from 'three';
import { OrbitControls } from './OrbitControls';
const tilesize = 51.2;
const levelChoice = 'l2';
const levelSource = {
    l1: { size: 64.0, count: 2 },
    l2: { size: 128.0, count: 3 },
};

const levelSize = levelSource[levelChoice].size;
const count = levelSource[levelChoice].count;

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 99999);
camera.position.z = 0.0001;
camera.lookAt(new Vector3(0, 0, 0));

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableZoom = true;

const direction = ['b', 'l', 'u', 'f', 'r', 'd'];
// const direction = ['b'];

const planePosition = [
    0, 0, 1, -1, 0, 0,
    0, 1, 0,
    0, 0, -1,
    1, 0, 0,
    0, -1, 0,
];
const planeNormal = [
    new Vector3(0, 1, 0), Math.PI,
    new Vector3(0, 1, 0), Math.PI / 2,
    new Vector3(1, 0, 0), Math.PI / 2,
    new Vector3(0, 1, 0), 0,
    new Vector3(0, 1, 0), -Math.PI / 2,
    new Vector3(1, 0, 0), -Math.PI / 2,
];
const fixed = num => Number(num.toFixed(1));

const sphereGroup = new Group();
for (const planeDirectionIndex in direction) {
    if (direction.hasOwnProperty(planeDirectionIndex)) {
        const runArray = Array.from(new Array(count), (v, i) => i + 1);
        const planeGroup = new Group();
        for (const rowIndex of runArray) {
            const rowHeight = fixed(rowIndex !== runArray.length ? tilesize : levelSize - tilesize * (rowIndex - 1));
            for (const columnIndex of runArray) {
                const columnWidth = fixed(columnIndex !== runArray.length ? tilesize : levelSize - tilesize * (columnIndex - 1));
                const loader = new TextureLoader();
                const geometry = new PlaneGeometry(columnWidth, rowHeight, 0);
                const material = new MeshBasicMaterial({
                    // side: boxDisplay[planeDirectionIndex],
                    map: loader.load(`./3.tiles/${direction[planeDirectionIndex]}/${levelChoice}/${rowIndex}/${levelChoice}_${direction[planeDirectionIndex]}_${rowIndex}_${columnIndex}.jpg`),
                });

                const tilePlane = new Mesh(geometry, material);
                tilePlane.position.x = tilesize * (columnIndex - 1);
                tilePlane.position.y = (-1) * tilesize * (rowIndex - 1);

                if (columnIndex === runArray.length) {
                    tilePlane.position.x = tilePlane.position.x - (tilesize - columnWidth) + (tilesize - columnWidth) / 2;
                }

                if (rowIndex === runArray.length) {
                    tilePlane.position.y = tilePlane.position.y + (tilesize - rowHeight) - (tilesize - rowHeight) / 2;
                }

                // const ax = new AxesHelper(3);
                // tilePlane.add(ax);

                // 移动到面中心
                tilePlane.position.x = tilePlane.position.x - (levelSize / 2) + tilesize / 2;
                tilePlane.position.y = tilePlane.position.y + (levelSize / 2) - tilesize / 2;

                console.warn(`${rowIndex}_${columnIndex}`, rowHeight, columnWidth, tilePlane.position);
                planeGroup.add(tilePlane);
            }
        }
        planeGroup.name = direction[planeDirectionIndex];

        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(
            planeNormal[planeDirectionIndex * 2],
            planeNormal[planeDirectionIndex * 2 + 1]
        );
        planeGroup.rotation.setFromQuaternion(quaternion);

        // const ax = new AxesHelper(30);
        // planeGroup.add(ax);

        planeGroup.position.set(
            planePosition[planeDirectionIndex * 3] * levelSize / 2,
            planePosition[planeDirectionIndex * 3 + 1] * levelSize / 2,
            planePosition[planeDirectionIndex * 3 + 2] * levelSize / 2
        );

        sphereGroup.add(planeGroup);
    }
}
scene.add(sphereGroup);


const render = () => {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(renderer.domElement);
}, false);

render();