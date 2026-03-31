import { APP_VERSION, APP_COMMIT_MESSAGE, APP_BUILD_TIME, APP_BUILD_HASH } from "@/version";

const Version = () => {
    return (
        <div className="text-center text-sm text-gray-400 py-2">
            V{APP_VERSION} ({APP_BUILD_HASH}) · {APP_COMMIT_MESSAGE} · Built on {new Date(APP_BUILD_TIME).toLocaleString()}
        </div>

    )
}

export default Version