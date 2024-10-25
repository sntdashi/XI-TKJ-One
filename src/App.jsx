import React, { useEffect } from "react"
import Home from "./Pages/Home"
import Carousel from "./Pages/Gallery"
import FullWidthTabs from "./Pages/Tabs"
import Footer from "./Pages/Footer"
import Chat from "./components/ChatAnonim"
import AOS from "aos"
import "aos/dist/aos.css"
import React, { useState } from 'react';
import LoginPanel from './components/LoginPanel'; // Sesuaikan dengan path yang benar

const App = () => {
    const [showLogin, setShowLogin] = useState(true);

    const handleLoginSuccess = () => {
        setShowLogin(false); // Sembunyikan panel setelah login berhasil
    };

    return (
        <div>
            {showLogin ? (
                <LoginPanel onLoginSuccess={handleLoginSuccess} />
            ) : (
                <h2>Selamat Datang!</h2>
            )}
        </div>
    );
};

function App() {
	useEffect(() => {
		AOS.init()
		AOS.refresh()
	}, [])

	return (
		<>
			<Home />

			<Carousel />
			<FullWidthTabs />

			<div id="Mesh1"></div>


			<div
				className="lg:mx-[12%] lg:mt-[-5rem] lg:mb-20 hidden lg:block"
				id="ChatAnonim_lg"
				data-aos="fade-up"
				data-aos-duration="1200">
				<Chat />
			</div>

			<Footer />
		</>
	)
}

export default App
