import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder icons - consider react-icons for a richer set
const LightBulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.354a15.996 15.996 0 01-4.5 0m4.5-4.5v5.25m0 0a5.991 5.991 0 11-11.982 0m11.982 0a5.991 5.991 0 01-11.982 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75M9 12.75L11.25 15 15 9.75" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-purple-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.19m0 5.669a9.094 9.094 0 01-3.741-.479m0 5.19a9.094 9.094 0 00-3.741-5.67M18 18.72v-5.67m0 5.67L18 12.829M18 12.829L18 10.99m0 1.83L18 9.151m-6.07 9.57L11.93 10.99M11.93 10.99L11.93 9.151M11.93 9.151M6.07 18.72L6.07 10.99M6.07 10.99L6.07 9.151M6.07 9.151M12 6.875a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM12 17.625a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const ExclamationTriangleIcon = ({className = "w-8 h-8 mb-2 text-yellow-400"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const ClockIcon = ({className = "w-8 h-8 mb-2 text-purple-400"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const LearnMorePage = () => {

  const Section = ({ title, children, icon }) => (
    <section className="mb-12 py-8 px-6 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50">
      <div className="flex items-center text-3xl font-semibold text-indigo-300 mb-6">
        {icon && <span className="mr-3">{icon}</span>}
        {title}
      </div>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-12">
      <header className="text-center border-b border-gray-700/50 pb-10 mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500">
            Understanding BitFrac Protocol
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Delving deeper into the innovation, technology, and vision that powers the future of fractionalized asset investment and revenue sharing.
        </p>
      </header>

      <Section title="Our Vision: Democratizing Asset Ownership" icon={<LightBulbIcon />}>
        <p>
          BitFrac Protocol emerges from a simple yet powerful vision: to make high-value investment opportunities accessible to everyone, everywhere. 
          Historically, significant assets like large-scale real estate, lucrative mining operations, or premier art collections have been the domain of a select few. 
          We believe that blockchain technology provides the perfect toolkit to dismantle these barriers, fostering a more inclusive and equitable financial future.
        </p>
        <p>
          Our goal is to empower individuals by transforming traditionally illiquid assets into easily tradable, divisible digital tokens. 
          This not only opens up new avenues for wealth creation but also brings unparalleled transparency and efficiency to asset management and revenue distribution.
        </p>
      </Section>

      <Section title="The Challenge: Barriers in Traditional Investment" icon={<ExclamationTriangleIcon className="w-8 h-8 mb-2 text-yellow-400"/>}>
        <p>
          Traditional investment in real-world assets (RWAs) often faces significant hurdles:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
          <li><span className="text-gray-200 font-medium">High Capital Requirements:</span> Many valuable assets require substantial upfront investment, excluding a majority of potential investors.</li>
          <li><span className="text-gray-200 font-medium">Illiquidity:</span> Selling stakes in physical assets can be a slow, complex, and costly process.</li>
          <li><span className="text-gray-200 font-medium">Lack of Transparency:</span> Information asymmetry and opaque processes can disadvantage smaller investors.</li>
          <li><span className="text-gray-200 font-medium">Geographical & Regulatory Barriers:</span> Access to certain investments can be restricted by location or complex legal frameworks.</li>
          <li><span className="text-gray-200 font-medium">Intermediary Costs:</span> Multiple layers of brokers, agents, and managers can erode returns.</li>
        </ul>
      </Section>

      <Section title="The BitFrac Solution: Tokenization & Decentralization" icon={<ShieldCheckIcon />}>
        <p>
          BitFrac leverages the power of smart contracts and tokenization to address these challenges head-on:
        </p>
        <ul className="list-disc list-inside space-y-3 pl-4 text-gray-400">
          <li>
            <strong className="text-indigo-300">Fractional Ownership via NFTs/Tokens:</strong> We represent ownership stakes in RWAs as unique digital tokens (likely NFTs for distinct assets, or fungible tokens representing shares). This allows assets to be divided into smaller, more affordable units, making investment accessible with lower capital.
          </li>
          <li>
            <strong className="text-indigo-300">Enhanced Liquidity:</strong> Tokenized assets can be traded more easily on decentralized (or compliant centralized) exchanges, providing investors with greater flexibility and faster exit opportunities.
          </li>
          <li>
            <strong className="text-indigo-300">Automated Revenue Distribution:</strong> Revenue generated by the underlying assets (e.g., rental income, mining profits) is collected and distributed automatically and transparently to token holders via smart contracts, based on their stake. Our <Link to="/revenue" className="text-purple-400 hover:text-purple-300 underline">Revenue Dashboard</Link> showcases this.
          </li>
          <li>
            <strong className="text-indigo-300">Transparent Governance (Future):</strong> We aim to implement a decentralized autonomous organization (DAO) where BFT token holders can participate in key governance decisions regarding the protocol, new asset listings, and treasury management.
          </li>
          <li>
            <strong className="text-indigo-300">Reduced Intermediary Reliance:</strong> Smart contracts automate many processes, potentially reducing the need for and cost of traditional intermediaries.
          </li>
        </ul>
      </Section>
      
      <Section title="Core Protocol Features" icon={<UsersIcon />}>
        <ul className="space-y-4">
          <li><strong className="text-purple-300 text-lg block">BFT Token Presale:</strong><p className="text-gray-400 text-sm">An opportunity for early supporters to acquire BFT, the native utility and governance token of the BitFrac ecosystem. The <Link to="/presale" className="text-indigo-400 hover:text-indigo-300 underline">Presale Page</Link> provides details on current or upcoming rounds.</p></li>
          <li><strong className="text-purple-300 text-lg block">Staking BFT:</strong><p className="text-gray-400 text-sm">Users can stake their BFT tokens to earn rewards, contribute to network security (if applicable to consensus), and potentially gain prioritized access or voting rights. Explore options on our <Link to="/staking" className="text-indigo-400 hover:text-indigo-300 underline">Staking Page</Link>.</p></li>
          <li><strong className="text-purple-300 text-lg block">Revenue Distribution Pools:</strong><p className="text-gray-400 text-sm">The heart of our value proposition. Revenue generated from tokenized assets is channeled into distribution pools and shared with eligible BFT holders/stakers. Monitor and claim your share via the <Link to="/revenue" className="text-indigo-400 hover:text-indigo-300 underline">Revenue Dashboard</Link>.</p></li>
        </ul>
      </Section>

      <Section title="BitFrac Token (BFT) - Utility & Tokenomics (Illustrative)" icon={<ChartBarIcon className="w-8 h-8 mb-2 text-purple-400" />}>
         <p className="mb-4">The BFT token is central to the BitFrac ecosystem, designed with multiple utilities to drive growth and user participation. (Note: Specific percentages and mechanisms are subject to final design and community governance).</p>
         <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                <h4 className="font-semibold text-indigo-300 mb-2">Key Utilities:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                    <li><span className="text-gray-200">Governance:</span> Voting on protocol upgrades and parameters.</li>
                    <li><span className="text-gray-200">Staking:</span> Earning rewards and securing the network.</li>
                    <li><span className="text-gray-200">Revenue Share Eligibility:</span> Holding or staking BFT may be required to receive a share of protocol revenues.</li>
                    <li><strong className="text-gray-200">Access Tiers:</strong> Potential for tiered access to exclusive RWA offerings based on BFT holdings.</li>
                    <li><span className="text-gray-200">Fee Reductions:</span> Possible discounts on protocol fees for BFT holders.</li>
                </ul>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                <h4 className="font-semibold text-indigo-300 mb-2">Illustrative Allocation:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                    <li><span className="text-gray-200">Presale Allocation:</span> (e.g., 20-30% - <em className="text-xs">Ref: PRESALE_ALLOCATION from contract</em>)</li>
                    <li><span className="text-gray-200">Staking Rewards & Mining:</span> (e.g., 30-40% - <em className="text-xs">Ref: MINING_REWARDS from contract</em>)</li>
                    <li><span className="text-gray-200">Team & Advisors:</span> (e.g., 10-15% - <em className="text-xs">Ref: TEAM_ALLOCATION from contract, vested</em>)</li>
                    <li><span className="text-gray-200">Ecosystem & Marketing:</span> (e.g., 10-15% - <em className="text-xs">Ref: MARKETING_ALLOCATION from contract</em>)</li>
                    <li><span className="text-gray-200">Liquidity Provision:</span> (e.g., 5-10%)</li>
                    <li><span className="text-gray-200">Treasury/Reserve:</span> (e.g., 5-10% for future development and DAO initiatives)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">Max Supply: (e.g., 1,000,000,000 BFT - <em className="text-xs">Ref: MAX_SUPPLY from contract</em>)</p>
            </div>
         </div>
      </Section>

      <Section title="Roadmap Highlights (Conceptual)" icon={<ClockIcon className="w-8 h-8 mb-2 text-purple-400" />}>
        <ul className="list-disc list-inside space-y-2 pl-4 text-gray-400">
            <li><strong className="text-gray-200">Phase 1 (Current):</strong> Protocol Launch, BFT Presale, Core Staking & Revenue Distribution Features.</li>
            <li><strong className="text-gray-200">Phase 2:</strong> Onboarding First Set of Real-World Assets (RWAs), Enhanced Liquidity Solutions.</li>
            <li><strong className="text-gray-200">Phase 3:</strong> DAO Governance Implementation, Cross-Chain RWA Integration Research.</li>
            <li><strong className="text-gray-200">Phase 4:</strong> Expansion of RWA Categories, Mobile Platform Development, Strategic Partnerships.</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">Note: This roadmap is illustrative and subject to change based on development progress and community feedback.</p>
      </Section>

      <div className="text-center py-10">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6">Ready to Join the Revolution?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/presale" className="group flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900">
                Participate in Presale <ArrowRightIcon />
            </Link>
            <Link to="/staking" className="group flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 text-indigo-300 bg-gray-700/70 hover:bg-gray-600/70 hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900">
                Explore Staking <ArrowRightIcon />
            </Link>
        </div>
      </div>

    </div>
  );
};

// Re-adding ChartBarIcon as it's used here
const ChartBarIcon = ({className = "w-8 h-8 mb-2 text-purple-400"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>;

export default LearnMorePage;
