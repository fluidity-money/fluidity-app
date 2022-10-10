import { useRef, useState } from "react"

type VideoSource = {
    src: string
    type: string
    width: number
    height: number
}

type AdvancedVideoProps = {
    transparent?: boolean
    playlist: VideoSource[]
    loop?: boolean // Always last video in playlist
    autoplay?: boolean
    muted?: boolean
    fit: "cover" | "contain" | "fill" | "none" | "scale-down"
    keyColor?: string // Only works with transparent videos
}

const AdvancedVideo = ({playlist, ...props}: AdvancedVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [currentVideo, setCurrentVideo] = useState(0);

    const currentVideoParam = playlist[currentVideo];

    const onEnded = () => {
        if (currentVideo < playlist.length - 1) {
            setCurrentVideo(currentVideo + 1);
        }
    }
    
    if (!playlist || !playlist.length) {
        return <div />
    }

    const isLastVideo = currentVideo === playlist.length - 1;

    return <>
        <video autoPlay loop={props.loop && isLastVideo} muted style={{ display: "none" }} ref={videoRef} onEnded={onEnded}>
            <source src={currentVideoParam.src} type={currentVideoParam.type} />
        </video>   
        <canvas ref={canvasRef} width={currentVideoParam.width} height={currentVideoParam.height} />
    </>
}

export default AdvancedVideo;