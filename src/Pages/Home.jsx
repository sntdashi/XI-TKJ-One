import BoxClassIg from "../components/BoxClassIg"
import BoxOldWeb from "../components/BoxOldWeb"
import BoxTextAnonim from "../components/BoxTextAnonim"
import Navbar from "../components/Navbar"
import BoxLemari from "../components/BoxLemari"

const Home = () => {
	return (
		<div className="text-white px-[10%]" id="Home">
			<Navbar />
			<div className="lg:hidden">
				<div className="font-bold text-5xl text-center py-20 ">XII TKJ ONE</div>
					<div className="border-2 flex justify-between px-4 md:px-10 text-2xl md:text-4xl font-bold py-2 relative">
						<div id="AngkaGradientBlue" className="flex items-center justify-center text-center md:text-left w-1/3 md:w-auto">
							43
						</div>
							<div className="text-center md:text-left w-1/3 md:w-auto">
							<span id="AngkaGradientBlue" className="text-2xl md:text-4xl">
								Siswa
							</span>
							</div>
								<div id="AngkaGradientPink" className="flex items-center justify-center text-center md:text-right w-1/3 md:w-auto">
									XII TKJ 1
								</div>
							</div>

				<div className="grid grid-cols-2 md:grid-cols-2 gap-7 md:gap-5">
					<div className="grid gap-2 md:gap-0 md:grid-cols-1">
						<BoxClassIg />
					</div>
					<div className="grid gap-2 md:gap-0 md:grid-cols-1">
						<BoxOldWeb />
						<BoxTextAnonim />
						<BoxLemari />
					</div>
				</div>
			</div>

			{/* Dekstop */}
			<div className="hidden lg:block">
				<div className="flex justify-center items-center flex-col h-[100vh]">
					<h5 className="text-[1.4rem] font-semibold">Hi, Visitor!</h5>
					<h1 className="text-7xl font-extrabold" id="Glow">
						WELCOME
					</h1>
					<h6 className="text-sm" style={{ letterSpacing: "5px" }}>
						TO XII TKJ ONE
					</h6>
				</div>
			</div>
		</div>
	)
}

export default Home
