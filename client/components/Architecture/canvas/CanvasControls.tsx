import {
    Controls
} from "@xyflow/react"

function CanvasControls() {
    return (
        <div>
            <Controls
                position="bottom-left"
                className="
                  !bg-white/90 dark:!bg-zinc-900/90
                  !border !border-zinc-200 dark:!border-zinc-800
                  !shadow-md !rounded-lg overflow-hidden
                  backdrop-blur-sm
                  [&>button]:!bg-transparent
                  [&>button]:!border-b [&>button]:!border-zinc-200/80 dark:[&>button]:!border-zinc-800
                  [&>button:last-child]:!border-b-0
                  [&>button]:text-zinc-700! dark:[&>button]:text-zinc-200!
                  [&>button:hover]:bg-zinc-100! dark:[&>button:hover]:bg-zinc-800/80!
                  [&>button_svg]:fill-current!
                "
                style={{ zIndex: 10 }}
            />
        </div>
    )
}

export default CanvasControls