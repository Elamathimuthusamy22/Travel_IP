import { Suspense } from "react";
import DestinationClient from "./DestinationClient";

export default function DestinationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DestinationClient />
        </Suspense>
    );
}
