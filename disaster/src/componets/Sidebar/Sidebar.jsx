import { motion } from "framer-motion";
import {
  ShieldAlert,
  Mountain,
  BrainCircuit,
  CheckCircle2,
  CloudRain,
} from "lucide-react";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

export default function Sidebar({ analysis, loading }) {

    // Support multiple response structures

    const floodScore =
        analysis?.risk?.flood?.score ??
        analysis?.report?.floodRisk?.score ??
        analysis?.floodRisk?.score ??
        0;

    const floodLevel =
        analysis?.risk?.flood?.level ??
        analysis?.report?.floodRisk?.level ??
        analysis?.floodRisk?.level ??
        "Analyzing...";

    const landslideScore =
        analysis?.risk?.landslide?.score ??
        analysis?.report?.landslideRisk?.score ??
        analysis?.landslideRisk?.score ??
        0;

    const landslideLevel =
        analysis?.risk?.landslide?.level ??
        analysis?.report?.landslideRisk?.level ??
        analysis?.landslideRisk?.level ??
        "Analyzing...";

    const confidence = Math.round(

        (

            analysis?.report?.overallAssessment?.confidence ??

            analysis?.overallAssessment?.confidence ??

            0

        ) * 100

    );

    const summary =

        analysis?.report?.executiveSummary ??

        analysis?.executiveSummary ??

        "Select a location on the map to begin AI analysis.";

    return (

        <aside className="sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-slate-800 p-5">

            <h2 className="text-2xl font-bold text-white">

                AI Intelligence

            </h2>

            <p className="text-slate-400 mb-6">

                Real-Time Disaster Analysis

            </p>

            <GaugeCard

                title="Flood Risk"

                value={floodScore}

                level={floodLevel}

                color="#3b82f6"

                loading={loading}

                icon={<ShieldAlert className="text-blue-400"/>}

            />

            <GaugeCard

                title="Landslide Risk"

                value={landslideScore}

                level={landslideLevel}

                color="#f97316"

                loading={loading}

                icon={<Mountain className="text-orange-400"/>}

            />

            {/* Confidence */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-5">

                <div className="flex items-center gap-3 mb-4">

                    <BrainCircuit className="text-purple-400"/>

                    <h3 className="text-white font-semibold">

                        AI Confidence

                    </h3>

                </div>

                {

                    loading ?

                    (

                        <div className="space-y-3 animate-pulse">

                            <div className="h-3 bg-slate-800 rounded"/>

                            <div className="h-3 bg-slate-800 rounded w-20"/>

                        </div>

                    )

                    :

                    (

                        <>

                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                                <motion.div

                                    initial={{ width: 0 }}

                                    animate={{ width: `${confidence}%` }}

                                    transition={{ duration: 1 }}

                                    className="h-full bg-purple-500"

                                />

                            </div>

                            <p className="text-right mt-3 text-white">

                                {confidence}%

                            </p>

                        </>

                    )

                }

            </div>

            {/* Summary */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-5">

                <div className="flex items-center gap-3 mb-4">

                    <CloudRain className="text-cyan-400"/>

                    <h3 className="text-white font-semibold">

                        Forecast Summary

                    </h3>

                </div>

                {

                    loading ?

                    (

                        <div className="space-y-3 animate-pulse">

                            <div className="h-4 bg-slate-800 rounded"/>

                            <div className="h-4 bg-slate-800 rounded w-11/12"/>

                            <div className="h-4 bg-slate-800 rounded w-4/5"/>

                            <div className="h-4 bg-slate-800 rounded w-3/4"/>

                        </div>

                    )

                    :

                    (

                        <motion.p

                            key={summary}

                            initial={{ opacity: 0 }}

                            animate={{ opacity: 1 }}

                            className="text-slate-300 text-sm leading-7"

                        >

                            {summary}

                        </motion.p>

                    )

                }

            </div>

            {/* Status */}

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">

                <div className="flex items-center gap-3 mb-4">

                    <CheckCircle2 className="text-green-400"/>

                    <h3 className="text-white font-semibold">

                        System Status

                    </h3>

                </div>

                <Status title="Weather API" loading={loading}/>
                <Status title="Satellite API" loading={loading}/>
                <Status title="AI Vision" loading={loading}/>
                <Status title="Risk Engine" loading={loading}/>

            </div>

        </aside>

    );

}

function GaugeCard({

    title,

    value,

    level,

    color,

    loading,

    icon

}){

    return(

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 mb-5">

            <div className="flex items-center gap-3 mb-4">

                {icon}

                <h3 className="text-white font-semibold">

                    {title}

                </h3>

            </div>

            {

                loading ?

                (

                    <div className="w-36 h-36 rounded-full bg-slate-800 animate-pulse mx-auto"/>

                )

                :

                (

                    <motion.div

                        key={value}

                        initial={{scale:0.9,opacity:0}}

                        animate={{scale:1,opacity:1}}

                    >

                        <div className="w-36 h-36 mx-auto">

                            <CircularProgressbar

                                value={value}

                                text={`${value}%`}

                                styles={buildStyles({

                                    pathColor:color,

                                    textColor:"#fff",

                                    trailColor:"#1e293b"

                                })}

                            />

                        </div>

                    </motion.div>

                )

            }

            <p className="text-center mt-4 text-green-400 font-medium">

                {level}

            </p>

        </div>

    );

}

function Status({ title, loading }){

    return(

        <div className="flex justify-between items-center mb-3">

            <span className="text-slate-300">

                {title}

            </span>

            <span className="flex items-center gap-2">

                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${loading ? "bg-yellow-400" : "bg-green-500"}`}/>

                <span className={`${loading ? "text-yellow-400" : "text-green-400"} text-sm`}>

                    {loading ? "Processing" : "Online"}

                </span>

            </span>

        </div>

    );

}