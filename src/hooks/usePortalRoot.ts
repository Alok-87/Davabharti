import { useEffect, useState } from "react";

export default function usePortalRoot(id: string) {
    const [element, setElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        let root = document.getElementById(id);

        // If root does not exist, create it dynamically
        if (!root) {
            root = document.createElement("div");
            root.setAttribute("id", id);
            document.body.appendChild(root);
        }

        setElement(root);
    }, [id]);

    return element;
}
