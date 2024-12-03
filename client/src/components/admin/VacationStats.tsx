import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { vacationService } from '../../services/vacation.service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsData {
  destination: string;
  followers: number;
}

const VacationStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vacationService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!stats.length) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          אין נתונים להצגה
        </Alert>
      </Container>
    );
  }

  const chartData = {
    labels: stats.map(stat => stat.destination),
    datasets: [
      {
        label: 'מספר עוקבים',
        data: stats.map(stat => stat.followers),
        backgroundColor: 'rgba(25, 118, 210, 0.5)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
        labels: {
          font: {
            family: 'Rubik',
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'סטטיסטיקת עוקבים לפי יעדים',
        font: {
          family: 'Rubik',
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        rtl: true,
        titleFont: {
          family: 'Rubik'
        },
        bodyFont: {
          family: 'Rubik'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: 'Rubik'
          }
        },
        title: {
          display: true,
          text: 'מספר עוקבים',
          font: {
            family: 'Rubik',
            size: 14
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Rubik'
          }
        },
        title: {
          display: true,
          text: 'יעדים',
          font: {
            family: 'Rubik',
            size: 14
          }
        }
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ fontFamily: 'Rubik', fontWeight: 'bold', mb: 4 }}
        >
          סטטיסטיקת חופשות
        </Typography>
        <Box sx={{ height: 500, mt: 4 }}>
          <Bar data={chartData} options={options} />
        </Box>
      </Paper>
    </Container>
  );
};

export default VacationStats; 