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

interface TimeEstimateEditorProps {
  onChange: (merge: Partial<TTask>) => void
  task: TTask
}

export const TimeEstimateEditor: React.FC<TimeEstimateEditorProps> = ({
  onChange,
  task
}) => {
  const [enabled, setEnabled] = useState(false)

  const handleEstimateChange = (value: number) => {
    if (!enabled) return

    onChange(
      task.timeEstimateValue
        ? {
            ...task,
            timeEstimateValue: value
          }
        : {
            timeEstimateValue: value,
            timeEstimateLowValue: undefined,
            timeEstimateLowPercentile: 10,
            timeEstimateHighValue: undefined,
            timeEstimateHighPercentile: 90
          }
    )
  }

  const handleLowChange = (value: number, percentile: number) => {
    if (!enabled || !task.timeEstimateValue) return

    onChange({
      ...task,
      timeEstimateLowValue: value,
      timeEstimateLowPercentile: percentile
    })
  }

  const handleHighChange = (value: number, percentile: number) => {
    if (!enabled || !task.timeEstimateValue) return

    onChange({
      ...task,
      timeEstimateHighValue: value,
      timeEstimateHighPercentile: percentile
    })
  }

  const handleEnabledChange = (enabled: boolean) => {
    setEnabled(enabled)
    if (enabled) {
      onChange({
        timeEstimateValue: 1,
        timeEstimateLowValue: undefined,
        timeEstimateLowPercentile: 10,
        timeEstimateHighValue: undefined,
        timeEstimateHighPercentile: 90
      })
    } else {
      onChange({
        timeEstimateValue: undefined,
        timeEstimateLowValue: undefined,
        timeEstimateLowPercentile: undefined,
        timeEstimateHighValue: undefined,
        timeEstimateHighPercentile: undefined
      })
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
              value={task.timeEstimateValue || ''}
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
              value={task.timeEstimateLowValue || ''}
              onChange={(e) =>
                handleLowChange(
                  parseFloat(e.target.value) || 0,
                  task.timeEstimateLowPercentile || 10
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
              value={task.timeEstimateLowPercentile || ''}
              onChange={(e) =>
                handleLowChange(
                  task.timeEstimateLowValue || 0,
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
              value={task.timeEstimateHighValue || ''}
              onChange={(e) =>
                handleHighChange(
                  parseFloat(e.target.value) || 0,
                  task.timeEstimateHighPercentile || 90
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
              value={task.timeEstimateHighPercentile || ''}
              onChange={(e) =>
                handleHighChange(
                  task.timeEstimateHighValue || 0,
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
