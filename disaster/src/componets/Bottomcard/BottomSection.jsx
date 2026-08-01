import SatelliteCard from "../SatelliteCard/SatelliteCard";
import SummaryCard from "../Summarycard/SummaryCard";
import RecommendationCard from "../RecommendationCard/RecommendationCard";

export default function BottomSection({

    analysis,

    loading

}) {

    console.log("Analysis");

    console.log(analysis);

    return (

        <div className="grid grid-cols-12 gap-5 mt-6">

            <div className="col-span-4">

                <SatelliteCard

                    image={analysis?.satelliteImage}

                    loading={loading}

                />

            </div>

            <div className="col-span-4">

                <SummaryCard

                    summary={

                        analysis?.report?.executiveSummary

                        ||

                        analysis?.executiveSummary

                    }

                    loading={loading}

                />

            </div>

            <div className="col-span-4">

                <RecommendationCard

                    recommendations={

                        analysis?.report?.recommendations

                        ||

                        analysis?.recommendations

                        ||

                        []

                    }

                    loading={loading}

                />

            </div>

        </div>

    );

}