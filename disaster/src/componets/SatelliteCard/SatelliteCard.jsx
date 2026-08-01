import { motion } from "framer-motion";
import { Satellite } from "lucide-react";
import { useEffect, useState } from "react";

export default function SatelliteCard({ image, loading }) {

    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {

        if (image) {

            setImageUrl(`${image}?v=${Date.now()}`);

        }

    }, [image]);

    return (

        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl h-full"
        >

            {/* Header */}

            <div className="flex items-center gap-3 p-4 border-b border-slate-800">

                <Satellite className="text-cyan-400"/>

                <h2 className="text-white font-semibold text-lg">

                    Satellite Image

                </h2>

            </div>

            {/* Body */}

            <div className="h-[240px] bg-slate-950 flex items-center justify-center">

                {loading ? (

                    <div className="w-full h-full animate-pulse p-4">

                        <div className="w-full h-full rounded-xl bg-slate-800"/>

                    </div>

                ) : imageUrl ? (

                    <motion.img

                        key={imageUrl}

                        src={imageUrl}

                        alt="Satellite"

                        initial={{ opacity: 0, scale: 0.96 }}

                        animate={{ opacity: 1, scale: 1 }}

                        transition={{ duration: 0.4 }}

                        className="w-full h-full object-cover"

                    />

                ) : (

                    <div className="text-center">

                        <Satellite
                            size={60}
                            className="mx-auto text-slate-600"
                        />

                        <p className="text-slate-500 mt-4">

                            Click a location on the map

                        </p>

                    </div>

                )}

            </div>

            {/* Footer */}

            <div className="px-4 py-3 border-t border-slate-800">

                <p className="text-xs text-slate-500">

                    Sentinel-2 • AI Vision

                </p>

            </div>

        </motion.div>

    );

}