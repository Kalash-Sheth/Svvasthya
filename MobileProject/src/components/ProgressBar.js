import React from 'react';
import { ProgressBar as PaperProgressBar } from 'react-native-paper';

export default function ProgressBar({ progress }) {
  return <PaperProgressBar progress={progress} />;
}
