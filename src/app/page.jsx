"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Wallet,
  ListChecks,
  Calendar as CalendarIcon,
  BarChart3,
  Calculator,
  TrendingUp,
  Bot,
  Layers,
  Plus,
  Search,
} from "lucide-react";

const INITIAL_BETS = [
  { id: 1, date: "2026-11-21", event: "Sevilla vs. Real Betis", sport: "Soccer", selection: "Real Betis Over 0.5 + Over 3.5", odds: 1.9, stake: 755, status: "Pending", profit: 679.5 },
  { id: 2, date: "2026-11-20", event: "Athletic Bilbao vs Espanyol", sport: "Soccer", selection: "Espanyol Over 0.5 + Under 5.5", odds: 1.7, stake: 1000, status: "Won", profit: 700 },
  { id: 3, date: "2026-11-19", event: "Seattle Sounders vs. Real Salt Lake", sport: "Soccer", selection: "Saba Over 0.5 SOT + Under 5.5", odds: 1.53, stake: 1000, status: "Won", profit: 530 },
  { id: 4, date: "2026-11-18", event: "São Paulo vs Fluminense", sport: "Soccer", selection: "Artur Victor 1+ Shots on Target", odds: 1.45, stake: 755, status: "Lost", profit: -755 },
  { id: 5, date: "2026-11-17", event: "New York Knicks vs. Toronto Raptors", sport: "Basketball", selection: "New York Knicks to win", odds: 1.63, stake: 755, status: "Won", profit: 475.65 },
];

export default function BetTrackerApp() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bets, setBets] = useState(INITIAL_BETS);
  const [showModal, setShowModal] = useState(false);

  const [event, setEvent] = useState("");
  const [sport, setSport] = useState("Soccer");
  const [selection, setSelection] = useState("");
  const [odds, setOdds] = useState("1.85");
  const [stake, setStake] = useState("250");
  const [status, setStatus] = useState("Pending");

  const [decimalOdds, setDecimalOdds] = useState("2.50");

  const startingCapital = 5000;
  const settledBets = bets.filter((b) => b.status !== "Pending");
  const totalProfit = settledBets.reduce((acc, b) => acc + b.profit, 0);
  const currentBalance = startingCapital + totalProfit;
  const wins = settledBets.filter((b) => b.status === "Won").length;
  const winRate = settledBets.length ? ((wins / settledBets.length) * 100).toFixed(1) : "0.0";
  const totalStaked = settledBets.reduce((acc, b) => acc + b.stake, 0);
  const roi = totalStaked ? ((totalProfit / totalStaked) * 100).toFixed(1) : "0.0";
  const avgOdds = bets.length ? (bets.reduce((acc, b) => acc + b.odds, 0) / bets.length).toFixed(2) : "0.00";

  const handleAddBet = (e) => {
    e.preventDefault();
    const numOdds = parseFloat(odds) || 1.0;
    const numStake = parseFloat(stake) || 0;
    const profit =
      status === "Won"
        ? numStake * (numOdds - 1)
        : status === "Lost"
        ? -numStake
        : numStake * (numOdds - 1);

    const newBet = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      event,
      sport,
      selection,
      odds: numOdds,
      stake: numStake,
      status,
      profit,
    };

    setBets([newBet, ...bets]);
    setEvent("");
    setSelection("");
    setShowModal(false);
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Bankrolls", icon: Wallet },
    { name: "My Bets", icon: ListChecks },
    { name: "Calendar", icon: CalendarIcon },
    { name: "Analytics", icon: BarChart3 },
    { name: "Calculators", icon: Calculator },
    { name: "Picks", icon: TrendingUp },
    { name: "AI Advisor", icon: Bot },
    { name: "Parlay Lab", icon: Layers },
  ];

  const dec = parseFloat(decimalOdds) || 0;
  const impliedProb = dec > 1 ? ((1 / dec) * 100).toFixed(2) : "0.00";
  const americanOdds =
    dec >= 2
      ? "+" + Math.round((dec - 1) * 100)
      : dec > 1
      ? "" + Math.round(-100 / (dec - 1))
      : "0";

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
      <aside className="w-60 bg-[#0E1320] border-r border-slate-800/80 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
              B
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">BetWise Tracker</h1>
              <p className="text-[11px] text-slate-400">Smart Betting Analytics</p>
            </div>
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={
                    active
                      ? "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-[#1C2438] text-white font-medium"
                      : "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4 text-xs text-slate-500 px-2">
          Powered by Next.js & Vercel
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">{activeTab}</h2>
            <p className="text-sm text-slate-400">
              Track your betting performance, bankroll, and analytics
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
          >
            <Plus className="w-4 h-4" /> Place New Bet
          </button>
        </div>

        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Starting Capital</p>
                <p className="text-2xl font-bold mt-1">
                  €{startingCapital.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Current Balance</p>
                <p className="text-2xl font-bold mt-1">
                  €{currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  {totalProfit >= 0 ? "+" : ""}€{totalProfit.toFixed(2)} from bets
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-4">
                <p className="text-[11px] uppercase text-slate-400">Total Profit</p>
                <p className="text-xl font-bold text-emerald-400 mt-1">
                  {totalProfit >= 0 ? "+" : ""}€{totalProfit.toFixed(2)}
                </p>
              </div>
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-4">
                <p className="text-[11px] uppercase text-slate-400">Win Rate</p>
                <p className="text-xl font-bold mt-1">{winRate}%</p>
                <p className="text-xs text-slate-500">
                  {wins}W - {settledBets.length - wins}L
                </p>
              </div>
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-4">
                <p className="text-[11px] uppercase text-slate-400">ROI</p>
                <p className="text-xl font-bold text-blue-400 mt-1">{roi}%</p>
              </div>
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-4">
                <p className="text-[11px] uppercase text-slate-400">Total Bets</p>
                <p className="text-xl font-bold mt-1">{bets.length}</p>
              </div>
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-4">
                <p className="text-[11px] uppercase text-slate-400">Avg Odds</p>
                <p className="text-xl font-bold mt-1">{avgOdds}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#131926] border border-slate-800/80 rounded-xl p-6">
                <h3 className="font-semibold mb-6">Daily Profit & Loss</h3>
                <div className="h-56 flex items-end gap-3 pt-6 border-b border-slate-800 px-2">
                  {[65, 40, -25, 50, 80, -35, 70, 95, 45, -60, 30, 55].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        style={{ height: Math.abs(val) * 1.6 + "px" }}
                        className={
                          val >= 0 ? "w-full rounded-t bg-emerald-500" : "w-full rounded-t bg-rose-500"
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>Nov 1</span>
                  <span>Nov 8</span>
                  <span>Nov 15</span>                 
            
                </div>
              </div>

              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Bets</h3>
                <div className="space-y-4">
                  {bets.slice(0, 5).map((bet) => (
                    <div key={bet.id} className="flex justify-between items-start border-b border-slate-800/60 pb-3">
                      <div>
                        <p className="text-sm font-medium">{bet.event}</p>
                        <p className="text-xs text-slate-400">
                          {bet.sport} • €{bet.stake}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={
                            bet.status === "Won"
                              ? "text-sm font-semibold text-emerald-400"
                              : bet.status === "Lost"
                              ? "text-sm font-semibold text-rose-400"
                              : "text-sm font-semibold text-amber-400"
                          }
                        >
                          {bet.profit >= 0
                            ? "+€" + bet.profit.toFixed(2)
                            : "-€" + Math.abs(bet.profit).toFixed(2)}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {bet.odds.toFixed(2)} • {bet.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "My Bets" && (
          <div className="bg-[#131926] border border-slate-800/80 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search teams, players, or sports..."
                className="bg-transparent text-sm focus:outline-none w-full"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0E1320] text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Selection</th>
                    <th className="py-3 px-4">Odds</th>
                    <th className="py-3 px-4">Stake</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bets.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-400">{b.date}</td>
                      <td className="py-3 px-4 font-medium">
                        {b.event}
                        <span className="block text-xs text-slate-500">{b.sport}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{b.selection}</td>
                      <td className="py-3 px-4">{b.odds.toFixed(2)}</td>
                      <td className="py-3 px-4">€{b.stake.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={
                            b.status === "Won"
                              ? "px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400"
                              : b.status === "Lost"
                              ? "px-2 py-0.5 rounded-full text-xs bg-rose-500/10 text-rose-400"
                              : "px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400"
                          }
                        >
                          {b.status}
                        </span>
                      </td>
                      <td
                        className={
                          b.status === "Lost"
                            ? "py-3 px-4 text-right font-semibold text-rose-400"
                            : "py-3 px-4 text-right font-semibold text-emerald-400"
                        }
                      >
                        {b.profit >= 0
                          ? "+€" + b.profit.toFixed(2)
                          : "-€" + Math.abs(b.profit).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Calculators" && (
          <div className="max-w-3xl bg-[#131926] border border-slate-800/80 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Odds & Probability Converter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Decimal Odds</label>
                <input
                  type="number"
                  step="0.01"
                  value={decimalOdds}
                  onChange={(e) => setDecimalOdds(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">American Odds</label>
                <input
                  type="text"
                  readOnly
                  value={americanOdds}
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Implied Probability</label>
                <input
                  type="text"
                  readOnly
                  value={impliedProb + "%"}
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-lg px-3 py-2 text-sm text-blue-400 font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {!["Dashboard", "My Bets", "Calculators"].includes(activeTab) && (
          <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-10 text-center">
            <h3 className="text-lg font-semibold mb-2">{activeTab} Module</h3>
            <p className="text-sm text-slate-400">
              Connect a database or API endpoint to power live {activeTab.toLowerCase()} data.
            </p>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#131926] border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Log New Bet</h3>
            <form onSubmit={handleAddBet} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Match / Event</label>
                <input
                  required
                  placeholder="e.g. Arsenal vs Liverpool"
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Sport</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-sm"
                  >
                    <option>Soccer</option>
                    <option>Basketball</option>
                    <option>Hockey</option>
                    <option>Football</option>
                    <option>Tennis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Selection</label>
                <input
                  required
                  placeholder="e.g. Both Teams to Score"
                  value={selection}
                  onChange={(e) => setSelection(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Decimal Odds</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}

                  <span>Nov 21</span>
