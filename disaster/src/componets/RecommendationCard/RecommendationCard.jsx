import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function RecommendationCard({

    recommendations = [],

    loading

}) {

    return (

        <motion.div

            initial={{opacity:0,y:20}}

            animate={{opacity:1,y:0}}

            className="bg-slate-900 rounded-2xl border border-slate-800 p-5 h-full"

        >

            <div className="flex items-center gap-3 mb-5">

                <ShieldCheck className="text-green-400"/>

                <h2 className="text-white font-semibold text-lg">

                    AI Recommendations

                </h2>

            </div>

            {

                loading ?

                (

                    <div className="space-y-4">

                        {[1,2,3].map((i)=>(

                            <div

                                key={i}

                                className="animate-pulse bg-slate-800 rounded-xl p-4"

                            >

                                <div className="h-4 bg-slate-700 rounded w-40 mb-4"/>

                                <div className="h-3 bg-slate-700 rounded mb-2"/>

                                <div className="h-3 bg-slate-700 rounded w-5/6"/>

                            </div>

                        ))}

                    </div>

                )

                :

                recommendations.length===0 ?

                (

                    <div className="flex items-center justify-center h-48">

                        <p className="text-slate-500">

                            No AI recommendations available.

                        </p>

                    </div>

                )

                :

                (

                    <div className="space-y-4">

                        {recommendations.map((item,index)=>(

                            <motion.div

                                key={index}

                                initial={{opacity:0,x:-20}}

                                animate={{opacity:1,x:0}}

                                transition={{delay:index*0.1}}

                                className="bg-slate-800 rounded-xl p-4"

                            >

                                <h3 className="text-green-400 font-semibold mb-2">

                                    {item.recommendation}

                                </h3>

                                <p className="text-slate-300 text-sm">

                                    {item.description}

                                </p>

                            </motion.div>

                        ))}

                    </div>

                )

            }

        </motion.div>

    );

}