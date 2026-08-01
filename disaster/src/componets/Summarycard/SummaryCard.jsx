import { motion } from "framer-motion";
import { CloudRain } from "lucide-react";

export default function SummaryCard({ summary, loading }) {

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full shadow-xl"
        >

            {/* Header */}

            <div className="flex items-center gap-3 mb-5">

                <CloudRain className="text-cyan-400" />

                <h2 className="text-white text-lg font-semibold">

                    Forecast Summary

                </h2>

            </div>

            {/* Loading */}

            {

                loading ? (

                    <div className="space-y-3 animate-pulse">

                        <div className="h-4 bg-slate-800 rounded w-full"></div>

                        <div className="h-4 bg-slate-800 rounded w-11/12"></div>

                        <div className="h-4 bg-slate-800 rounded w-10/12"></div>

                        <div className="h-4 bg-slate-800 rounded w-8/12"></div>

                        <div className="h-4 bg-slate-800 rounded w-9/12"></div>

                    </div>

                ) : (

                    <motion.p

                        key={summary}

                        initial={{ opacity: 0 }}

                        animate={{ opacity: 1 }}

                        transition={{ duration: 0.5 }}

                        className="text-slate-300 leading-7 text-sm"

                    >

                        {

                            summary ||

                            "Click on a location to generate an AI environmental forecast."

                        }

                    </motion.p>

                )

            }

        </motion.div>

    );

}