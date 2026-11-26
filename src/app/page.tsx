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

type Bet = {
  id: number;
  date: string;
  event: string;
  sport: string;
  selection: string;
  odds: number;
  stake: number;
  status: "Won" | "Lost" | "Pending";
  profit: number;
};

const INITIAL_BETS: Bet[] = [
  { id: 1, date: "2026-11-21", event: "Sevilla vs. Real Betis", sport: "Soccer", selection: "Real Betis Over 0.5 + Over 3.5", odds: 1.9, stake: 755, status: "Pending", profit: 679.5 },
  { id: 2, date: "2026-11-20", event: "Athletic Bilbao vs Espanyol", sport: "Soccer", selection: "Espanyol Over 0.5 + Under 5.5", odds: 1.7, stake: 1000, status: "Won", profit: 700 },
  { id: 3, date: "2026-11-19", event: "Seattle Sounders vs. Real Salt Lake", sport: "Soccer", selection: "Saba Over 0.5 SOT + Under 5.5", odds: 1.53, stake: 1000, status: "Won", profit: 530 },
  { id: 4, date: "2026-11-18", event: "São Paulo vs Fluminense", sport: "Soccer", selection: "Artur Victor 1+ Shots on Target", odds: 1.45, stake: 755, status: "Lost", profit: -755 },
  { id: 5, date: "2026-11-17", event: "New York Knicks vs. Toronto Raptors", sport: "Basketball", selection: "New York Knicks to win", odds: 1.63, stake: 755, status: "Won", profit: 475.65 },
];

export default function BetTrackerApp() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bets, setBets] = useState<Bet[]>(INITIAL_BETS);
  const [showModal, setShowModal] = useState(false);

  // New Bet Form State
  const [event, setEvent] = useState("");
  const [sport, setSport] = useState("Soccer");
  const [selection, setSelection] = useState("");
  const [odds, setOdds] = useState("1.85");
  const [stake, setStake] = useState("250");
  const [status, setStatus] = useState<"Won" | "Lost" | "Pending">("Pending");

  // Odds Converter State
  const [decimalOdds, setDecimalOdds] = useState<string>("2.50");

  const startingCapital = 5000;
  const settledBets = bets.filter((b) => b.status !== "Pending");
  const totalProfit = settledBets.reduce((acc, b) => acc + b.profit, 0);
  const currentBalance = startingCapital + totalProfit;
  const wins = settledBets.filter((b) => b.status === "Won").length;
  const winRate = settledBets.length ? ((wins / settledBets.length) * 100).toFixed(1) : "0.0";
  const totalStaked = settledBets.reduce((acc, b) => acc + b.stake, 0);
  const roi = totalStaked ? ((totalProfit / totalStaked) * 100).toFixed(1) : "0.0";
  const avgOdds = bets.length ? (bets.reduce((acc, b) => acc + b.odds, 0) / bets.length).toFixed(2) : "0.00";

  const handleAddBet = (e: React.FormEvent) => {
    e.preventDefault();
    const numOdds = parseFloat(odds) || 1.0;
    const numStake = parseFloat(stake) || 0;
    const profit =
      status === "Won"
        ? numStake * (numOdds - 1)
        : status === "Lost"
        ? -numStake
        : numStake * (numOdds - 1);

    const newBet: Bet = {
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

  // Odds conversions
  const dec = parseFloat(decimalOdds) || 0;
  const impliedProb = dec > 1 ? ((1 / dec) * 100).toFixed(2) : "0.00";
  const americanOdds =
    dec >= 2 ? `+${Math.round((dec - 1) * 100)}` : dec > 1 ? `${Math.round(-100 / (dec - 1))}` : "0";

  return (
    <div className="flex min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
      {/* Sidebar */}
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    active
                      ? "bg-[#1C2438] text-white font-medium"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
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

        {/* DASHBOARD VIEW */}
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            {/* Top 2 Capital Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Starting Capital</p>
                <p className="text-2xl font-bold mt-1">€{startingCapital.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-[#131926] border border-slate-800/80 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Current Balance</p>
                <p className="text-2xl font-bold mt-1">€{currentBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-emerald-400 mt-1">
                  {totalProfit >= 0 ? "+" : ""}€{totalProfit.toFixed(2)} from bets
                </p>
              </div>
            </div>

            {/* 5 Metric Row */}
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
                <p className="text-xs text-slate-500">{wins}W - {settledBets.length - wins}L</p>
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

            {/* Chart & Recent Bets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart Placeholder */}
              <div className="lg:col-span-2 bg-[#131926] border border-slate-800/80 rounded-xl p-6">
                <h3 className="font-semibold mb-6">Daily Profit & Loss</h3>
                <div className="h-56 flex items-end gap-3 pt-6 border-b border-slate-800 px-2">
                  {[65, 40, -25, 50, 80, -35, 70, 95, 45, -60, 30, 55].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        style={{ height: `${Math.abs(val) * 1.6}px` }}
