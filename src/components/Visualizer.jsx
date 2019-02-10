import React, { Component } from 'react';

import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

class Visualizer extends Component {
    getCanvasRef = (node) => (this.__canvas = node);

    init() {
        // initialize audioContext and get canvas
        const audioContext = new AudioContext();
        const audioNode = new AnalyserNode(audioContext);

        const visualizer = butterchurn.createVisualizer(audioContext, canvas, {
            width: 800,
            height: 600
        });

        // get audioNode from audio source or microphone

        visualizer.connectAudio(audioNode);

        // load a preset

        const presets = butterchurnPresets.getPresets();
        const preset =
            presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];

        visualizer.loadPreset(preset, 0.0); // 2nd argument is the number of seconds to blend presets

        // resize visualizer

        visualizer.setRendererSize(1600, 1200);

        // render a frame

        visualizer.render();
    }

    render() {
        const { getCanvasRef } = this;

        return <canvas className="player__visualizer" ref={getCanvasRef} />;
    }
}

export default Visualizer;
