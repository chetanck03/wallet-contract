import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet'; // To get account info for personalized greeting

// Example icons (can be replaced with a library like react-icons later)
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const HomePage = () => {
  const { account } = useWallet();

  const protocolStats = {
    tvl: '1,250,345', 
    bftPrice: '0.15',
    totalRevenueDistributed: '75,890', 
    activeStakers: '1,234',
  };

  const userSummary = {
    bftBalance: '10,500', 
    totalStaked: '8,000',
    claimableRevenue: '150',
  };

  const StatCard = ({ title, value, unit = '' , icon }) => (
    <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-700/50 transform hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 ease-out">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider ml-1">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white mt-1">{value} <span className="text-lg text-gray-400">{unit}</span></p>
    </div>
  );

  const ActionButton = ({ to, children, primary = false, className = '' }) => (
    <Link 
      to={to}
      className={`group inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${className} 
        ${primary 
          ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:ring-indigo-500' 
          : 'text-indigo-300 bg-gray-700/70 hover:bg-gray-600/70 hover:text-indigo-200 focus:ring-gray-500'}`}
    >
      {children} <ArrowRightIcon />
    </Link>
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="text-center py-12 sm:py-16 bg-gray-850/40 rounded-2xl shadow-2xl border border-gray-700/40">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500">Welcome to BitFrac</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 px-4">
          The Future of Fractionalized Real-World Assets & Transparent Revenue Sharing, Secured by Blockchain.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <ActionButton to="/presale" primary>Join Presale</ActionButton>
          <ActionButton to="/staking">Explore Staking</ActionButton>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-10">Protocol At a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Value Locked" value={`$${protocolStats.tvl}`} icon={<ChartBarIcon className="text-purple-400" />} />
          <StatCard title="BFT Token Price" value={`$${protocolStats.bftPrice}`} unit="USD" icon={<ChartBarIcon className="text-teal-400" />} />
          <StatCard title="Revenue Distributed" value={`$${protocolStats.totalRevenueDistributed}`} icon={<ChartBarIcon className="text-green-400" />} />
          <StatCard title="Active Stakers" value={protocolStats.activeStakers} icon={<UserCircleIcon className="text-sky-400" />} />
        </div>
      </section>

      {account && (
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-10">Your Personal Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Your BFT Balance" value={userSummary.bftBalance} unit="BFT" icon={<UserCircleIcon />} />
            <StatCard title="Your Total Staked" value={userSummary.totalStaked} unit="BFT" icon={<UserCircleIcon />} />
            <StatCard title="Claimable Revenue" value={`$${userSummary.claimableRevenue}`} icon={<UserCircleIcon />} />
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <div className="bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700/50 flex flex-col">
          <h3 className="text-2xl font-semibold text-indigo-300 mb-6">Explore Core Features</h3>
          <ul className="space-y-4 text-gray-300 flex-grow">
            {[{title: "Token Presale", desc: "Acquire BFT tokens early and become a foundational part of our ecosystem.", link: "/presale", cta: "Go to Presale"},
             {title: "Revenue Sharing", desc: "Earn passive income from protocol revenue distributed to BFT holders.", link: "/revenue", cta: "View Revenue"},
             {title: "BFT Staking", desc: "Stake your BFT to enhance network security and earn attractive rewards.", link: "/staking", cta: "Stake BFT Now" }
            ].map(item => (
              <li key={item.title} className="p-5 bg-gray-700/50 rounded-xl hover:bg-gray-700/70 transition-all duration-200 shadow-lg hover:shadow-purple-500/10 border border-gray-600/50">
                <h4 className="font-semibold text-xl text-indigo-400 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{item.desc}</p>
                <Link to={item.link} className="inline-block text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group">
                  {item.cta} <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700/50 flex flex-col">
            <h3 className="text-2xl font-semibold text-indigo-300 mb-6">About BitFrac Protocol</h3>
            <div className="text-gray-300 space-y-4 flex-grow">
                <p className="leading-relaxed">
                    BitFrac is a decentralized finance (DeFi) protocol designed to bridge the gap between real-world assets (RWAs) and the limitless potential of blockchain technology. We are pioneering a new era of investment by creating a transparent, secure, and accessible platform for fractional ownership and revenue distribution.
                </p>
                <p className="leading-relaxed">
                    Our core mission is to democratize access to high-value assets that were previously out of reach for many. By tokenizing RWAs, BitFrac allows users to invest in fractions of these assets, participate in their revenue streams, and benefit from potential appreciation. 
                </p>
                <p className="leading-relaxed">
                    The protocol ensures transparency through on-chain governance and smart contract-automated revenue sharing. BFT token holders can participate in staking to earn rewards and contribute to the security and stability of the ecosystem. Join us in revolutionizing how value is created, shared, and managed.
                </p>
            </div>
            <Link to="/learn-more" className="mt-8 inline-block text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group self-start">
                Discover Our Whitepaper & Vision <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
            </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
