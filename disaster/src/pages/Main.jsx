import React, { useRef, useState } from "react";
import axios from "axios";

import Sidebar from "../componets/Sidebar/Sidebar";
import BottomSection from "../componets/Bottomcard/BottomSection";
import DisasterMap from "../componets/Dashboard/Dashboard";

export default function Main() {

    const [loading, setLoading] = useState(false);

    const [analysis, setAnalysis] = useState(null);

    const controller = useRef(null);

    async function handleLocation(lat, lng) {

        if (loading) return;

        if (controller.current) {

            controller.current.abort();

        }

        controller.current = new AbortController();

        setLoading(true);

        setAnalysis(null);

        try {

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/analyze`,
                {
                    lat,
                    lng,
                },
                {
                    signal: controller.current.signal,
                }
            );


            setAnalysis({

                ...data,

                refresh: Date.now()

            });

        }

        catch (err) {

            if (err.name !== "CanceledError") {

                console.log(err);

            }

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="bg-slate-950 min-h-screen pt-24 px-6">

            <div className="grid grid-cols-12 gap-6">

                {/* MAP */}

                <div className="col-span-9">

                    <div className="relative">

                        {

                            loading && (

                                <div className="absolute inset-0 z-40 rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center">

                                    <div className="text-center">

                                        <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto" />

                                        <p className="text-white mt-5">

                                            AI analysing location...

                                        </p>

                                    </div>

                                </div>

                            )

                        }

                        <DisasterMap

                            loading={loading}

                            onLocationSelect={handleLocation}

                        />

                    </div>

                    <BottomSection

                        analysis={analysis}

                        loading={loading}

                    />

                </div>

                {/* SIDEBAR */}

                <div className="col-span-3">

                    <Sidebar

                        analysis={analysis}

                        loading={loading}

                    />

                </div>

            </div>

        </div>

    );

}