import { motion } from "framer-motion";

import {
  Bell,
  ShieldCheck,
  UserCircle2,
  Satellite,
  MapPin,
} from "lucide-react";

export default function Navbar() {

  return (

    <motion.nav

      initial={{ y: -80, opacity: 0 }}

      animate={{ y: 0, opacity: 1 }}

      transition={{ duration: 0.5 }}

      className="fixed top-0 left-0 right-0 z-50 h-20 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800"

    >

      <div className="h-full px-8 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-4">

          <div
            className="
              h-12
              w-12
              rounded-xl
              bg-blue-600
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-500/40
            "
          >

            <Satellite className="text-white" size={26} />

          </div>

          <div>

            <h1 className="text-3xl font-bold tracking-wide text-white">

              DMAPS

            </h1>

            <p className="text-xs text-slate-400">

              Disaster Monitoring & Prediction System

            </p>

          </div>

        </div>

        {/* Center Panel */}

        <div className="hidden lg:flex items-center">

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            className="
              flex
              items-center
              gap-4
              px-8
              py-3
              rounded-2xl
              bg-slate-900/80
              border
              border-slate-800
              shadow-xl
            "

          >

            <div

              className="
                h-10
                w-10
                rounded-xl
                bg-cyan-500/20
                flex
                items-center
                justify-center
              "

            >

              <MapPin

                className="text-cyan-400"

                size={20}

              />

            </div>

            <div>

              <h3 className="text-white font-semibold">

                Interactive Analysis

              </h3>

              <p className="text-xs text-slate-400">

                Click anywhere on the map to begin AI prediction

              </p>

            </div>

          </motion.div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Live */}

          <div className="hidden md:flex items-center gap-2">

            <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-green-400 font-semibold">

              LIVE

            </span>

          </div>

          {/* Health */}

          <div

            className="
              hidden
              xl:flex
              items-center
              gap-2
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-2
            "

          >

            <ShieldCheck

              className="text-green-500"

              size={20}

            />

            <span className="text-sm text-slate-300">

              System Healthy

            </span>

          </div>

          {/* Notification */}

          <button

            className="
              h-11
              w-11
              rounded-xl
              bg-slate-900
              border
              border-slate-700
              hover:border-cyan-500
              transition
              flex
              items-center
              justify-center
            "

          >

            <Bell

              className="text-slate-300"

              size={20}

            />

          </button>

          {/* Admin */}

          <button

            className="
              flex
              items-center
              gap-2
              bg-slate-900
              px-3
              py-2
              rounded-xl
              border
              border-slate-700
              hover:border-cyan-500
              transition
            "

          >

            <UserCircle2

              size={26}

              className="text-slate-300"

            />

            <span className="hidden md:block text-white">

              Admin

            </span>

          </button>

        </div>

      </div>

    </motion.nav>

  );

}