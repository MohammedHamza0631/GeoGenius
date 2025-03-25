"use client";
import { WorldMap } from "@/components/ui/world-map";
import { motion } from "motion/react";

export function WorldMapDemo() {
  // Capital cities for the quiz-relevant connections
  return (
    <div className="w-full dark:bg-black bg-white">
      <WorldMap
        dots={[
          // North America connections
          {
            start: { lat: 38.8951, lng: -77.0364 }, // Washington DC
            end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
          },
          {
            start: { lat: 45.4215, lng: -75.6972 }, // Ottawa
            end: { lat: 38.8951, lng: -77.0364 }, // Washington DC
          },
          // Europe connections
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 48.8566, lng: 2.3522 }, // Paris
          },
          {
            start: { lat: 48.8566, lng: 2.3522 }, // Paris
            end: { lat: 41.9028, lng: 12.4964 }, // Rome
          },
          {
            start: { lat: 52.5200, lng: 13.4050 }, // Berlin
            end: { lat: 55.7558, lng: 37.6173 }, // Moscow
          },
          // Asia connections
          {
            start: { lat: 39.9042, lng: 116.4074 }, // Beijing
            end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
          },
          {
            start: { lat: 28.6139, lng: 77.2090 }, // New Delhi
            end: { lat: 39.9042, lng: 116.4074 }, // Beijing
          },
          // Australia and Oceania
          {
            start: { lat: -35.2809, lng: 149.1300 }, // Canberra
            end: { lat: -41.2865, lng: 174.7762 }, // Wellington
          },
          // Africa connections
          {
            start: { lat: 30.0444, lng: 31.2357 }, // Cairo
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
          // Cross-continental connections
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: -33.8688, lng: 151.2093 }, // Sydney
          },
          {
            start: { lat: 38.8951, lng: -77.0364 }, // Washington DC
            end: { lat: 55.7558, lng: 37.6173 }, // Moscow
          },
          {
            start: { lat: -15.7942, lng: -47.8822 }, // Brasilia
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]} 
        lineColor="#6366f1" // Indigo color for the quiz theme
      />
    </div>
  );
} 