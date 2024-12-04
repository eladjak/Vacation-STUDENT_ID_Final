import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { vacationService } from '../../services/vacation.service';
import { Download as DownloadIcon } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface VacationStat {
  destination: string;
  followers: number;
}

const VacationStats: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<VacationStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vacationService.getStats();
        console.log('Received stats data:', data);
        if (!data || !Array.isArray(data)) {
          throw new Error('התקבלו נתונים לא תקינים מהשרת');
        }
        const sortedData = [...data].sort((a, b) => b.followers - a.followers);
        setStats(sortedData);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const downloadCSV = () => {
    try {
      const csvContent = '\ufeff' + [
        ['יעד', 'מספר עוקבים'],
        ...stats.map(stat => [stat.destination, stat.followers])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `סטטיסטיקת_חופשות_${new Date().toLocaleDateString('he-IL')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setError('שגיאה בהורדת הקובץ');
    }
  };

  const chartData = {
    labels: stats.map(stat => stat.destination),
    datasets: [
      {
        label: 'מספר עוקבים',
        data: stats.map(stat => stat.followers),
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: theme.palette.primary.light
      }
    ]
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true,
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'סטטיסטיקת עוקבים לפי יעד',
        font: {
          family: theme.typography.fontFamily,
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        titleFont: {
          family: theme.typography.fontFamily
        },
        bodyFont: {
          family: theme.typography.fontFamily
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: theme.typography.fontFamily
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: theme.typography.fontFamily
          },
          stepSize: 1
        }
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!stats.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          אין נתונים סטטיסטיים להצגה
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          סטטיסטיקת חופשות
        </Typography>
        <Tooltip title="הורד כקובץ CSV">
          <IconButton onClick={downloadCSV} color="primary">
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              height: '60vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={`stat-${stat.destination}-${index}`}>
            <Paper 
              sx={{ 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant="h6" component="h2" align="center">
                {stat.destination}
              </Typography>
              <Typography 
                variant="h4" 
                component="p" 
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                {stat.followers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                עוקבים
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default VacationStats; 