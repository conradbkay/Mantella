import React, { useState } from 'react'
import {
  Box,
  TextField,
  Divider,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material'
import { TTask } from '../../types/project'

type TimeEstimate = TTask['timeEstimate']

interface TimeEstimateEditorProps {
  timeEstimate?: TimeEstimate
  onChange: (timeEstimate: TimeEstimate | undefined) => void
}

export const TimeEstimateEditor: React.FC<TimeEstimateEditorProps> = ({
  timeEstimate,
  onChange
}) => {
  const [enabled, setEnabled] = useState(!!timeEstimate)

  const handleEstimateChange = (value: number) => {
    if (!enabled) return

    onChange(
      timeEstimate
        ? {
            ...timeEstimate,
            estimate: value
          }
        : {
            estimate: value,
            low: { value: undefined, percentile: 10 },
            high: { value: undefined, percentile: 90 }
          }
    )
  }

  const handleLowChange = (value: number, percentile: number) => {
    if (!enabled || !timeEstimate) return

    onChange({
      ...timeEstimate,
      low: { value, percentile }
    })
  }

  const handleHighChange = (value: number, percentile: number) => {
    if (!enabled || !timeEstimate) return

    onChange({
      ...timeEstimate,
      high: { value, percentile }
    })
  }

  const handleEnabledChange = (enabled: boolean) => {
    setEnabled(enabled)
    if (enabled) {
      onChange({
        estimate: 1,
        low: { value: undefined, percentile: 10 },
        high: { value: undefined, percentile: 90 }
      })
    } else {
      onChange(undefined)
    }
  }

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
          />
        }
        label="Use Time Estimates"
      />

      {enabled && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TextField
              type="number"
              label="Median Estimate (hours)"
              value={timeEstimate?.estimate || ''}
              onChange={(e) =>
                handleEstimateChange(parseFloat(e.target.value) || 0)
              }
              InputProps={{
                inputProps: { min: 0, step: 1 }
              }}
              sx={{ width: 200 }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              type="number"
              label="Low Estimate (hours)"
              value={timeEstimate?.low?.value || ''}
              onChange={(e) =>
                handleLowChange(
                  parseFloat(e.target.value) || 0,
                  timeEstimate?.low?.percentile || 10
                )
              }
              InputProps={{
                inputProps: { min: 0, step: 1 }
              }}
              sx={{ width: 200 }}
            />
            <TextField
              type="number"
              label="Percentile"
              value={timeEstimate?.low?.percentile || ''}
              onChange={(e) =>
                handleLowChange(
                  timeEstimate?.low?.value || 0,
                  parseInt(e.target.value) || 10
                )
              }
              InputProps={{
                inputProps: { min: 1, max: 49 }
              }}
              sx={{ width: 100 }}
            />
            <Typography variant="body2" color="text.secondary">
              %
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="number"
              label="High Estimate (hours)"
              value={timeEstimate?.high?.value || ''}
              onChange={(e) =>
                handleHighChange(
                  parseFloat(e.target.value) || 0,
                  timeEstimate?.high?.percentile || 90
                )
              }
              InputProps={{
                inputProps: { min: 0, step: 1 }
              }}
              sx={{ width: 200 }}
            />
            <TextField
              type="number"
              label="Percentile"
              value={timeEstimate?.high?.percentile || ''}
              onChange={(e) =>
                handleHighChange(
                  timeEstimate?.high?.value || 0,
                  parseInt(e.target.value) || 90
                )
              }
              InputProps={{
                inputProps: { min: 51, max: 99 }
              }}
              sx={{ width: 100 }}
            />
            <Typography variant="body2" color="text.secondary">
              %
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}
    </Box>
  )
}
