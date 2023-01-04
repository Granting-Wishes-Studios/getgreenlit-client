import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const Alert = () => {
    return (
        <div className="absolute right-5 top-20 bg-green-600 rounded-lg w-60 py-2 px-6 flex items-center gap-x-4">
        <FontAwesomeIcon icon={faCheck} className="text-white" />
        <span className="text-white font-semibold text-sm">
          Space Created
        </span>
      </div>
    )
}