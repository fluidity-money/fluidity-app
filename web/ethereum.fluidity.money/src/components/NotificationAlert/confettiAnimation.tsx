// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import confetti from 'canvas-confetti';
import { createPortal } from 'react-dom';
import { useRef } from 'react';

// confetti animation trigger for successful rewardpool win
const ConfettiAnimation = ({trigger}:{trigger: boolean}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    if(trigger) {
      const myConfettiAnimation = confetti.create(canvasRef.current!, {
        resize: true,
        useWorker: false,
      });

      myConfettiAnimation({
        particleCount: 100,
        spread: 160
      });
      return createPortal(<canvas className="confetti" ref={canvasRef}></canvas>, document.querySelector('#modal-generic')!);
    }
    return <></>
}

export default ConfettiAnimation;
