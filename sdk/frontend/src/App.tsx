import { useState, useEffect } from 'react';
import '@livekit/components-styles';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useConnectionState,
  useRemoteParticipants,
  useVoiceAssistant,
  BarVisualizer,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

const TOKEN_SERVER = import.meta.env.VITE_TOKEN_SERVER || 'http://localhost:8080/token';
const DEFAULT_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://faf-voice-hbdjdwmn.livekit.cloud';

// Load Roboto Mono
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Theme colors
const themes = {
  dark: {
    bg: '#0a0a0a',
    surface: '#111',
    surfaceAlt: '#1a1a1a',
    text: '#fff',
    textMuted: '#888',
    accent: '#00D4D4', // Cyan sweetspot
    orange: '#FF6B35', // FAF Orange
    border: '#333',
  },
  light: {
    bg: '#f5f5f5',
    surface: '#fff',
    surfaceAlt: '#e8e8e8',
    text: '#111',
    textMuted: '#666',
    accent: '#00D4D4',
    orange: '#FF6B35',
    border: '#ddd',
  },
};

type Theme = 'dark' | 'light';

// WolfejamGizmo - Signature half-moon theme toggle
function WolfejamGizmo({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          opacity: showTooltip ? 1 : 0,
          transition: 'opacity 0.2s ease',
          fontFamily: '"Roboto Mono", monospace',
        }}
      >
        {isDark ? 'Light Mode' : 'Dark Mode'}
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid rgba(0, 0, 0, 0.9)',
          }}
        />
      </div>

      {/* Button */}
      <button
        onClick={onToggle}
        aria-label="Toggle theme"
        style={{
          width: '48px',
          height: '48px',
          padding: 0,
          background: 'transparent',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          outline: 'none',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 212, 212, 0.4)';
          setShowTooltip(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
          setShowTooltip(false);
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #FFF 50%, #121212 50%)',
            transition: 'transform 0.3s ease',
            borderRadius: '50%',
            transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
    </div>
  );
}

function App() {
  const [token, setToken] = useState<string>('');
  const [url, setUrl] = useState<string>(DEFAULT_URL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('faf-theme') as Theme) || 'dark';
  });

  const colors = themes[theme];

  useEffect(() => {
    localStorage.setItem('faf-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(TOKEN_SERVER);
      if (!res.ok) throw new Error('Token server unavailable');
      const data = await res.json();
      setToken(data.token);
      setUrl(data.url || DEFAULT_URL);
    } catch (err) {
      setError('Token server not running. Start it with: python token_server.py');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: '"Roboto Mono", monospace',
    background: colors.bg,
    color: colors.text,
    transition: 'all 0.3s ease',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const toggleStyle = {
    padding: '0.5rem 1rem',
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '20px',
    color: colors.text,
    cursor: 'pointer',
    fontSize: '0.9rem',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={{ color: colors.orange }}>FAF-Voice</h1>
        <p>Connecting to Wolfe-Core...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={{ color: colors.orange }}>FAF-Voice</h1>
        <p style={{ color: '#c00' }}>{error}</p>
        <button onClick={fetchToken} style={{ ...toggleStyle, marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: colors.orange }}>FAF-Voice</h1>
          <p style={{ margin: '0.25rem 0 0', color: colors.textMuted, fontSize: '0.9rem' }}>
            Wolfe-Core Eternal — 2KB Soul
          </p>
        </div>
        <WolfejamGizmo
          isDark={theme === 'dark'}
          onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      </div>

      <LiveKitRoom
        serverUrl={url}
        token={token}
        connect={true}
        audio={true}
        video={true}
        style={{ marginTop: '1rem' }}
      >
        <RoomAudioRenderer />
        <ControlBar />
        <VoiceStatus colors={colors} />
      </LiveKitRoom>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={fetchToken} style={toggleStyle}>
          New Session
        </button>
      </div>

      <p style={{ marginTop: '2rem', color: colors.textMuted, fontSize: '0.85rem' }}>
        Ask: "What is FAF?" • "Who are you?" • "Does xAI need this?"
      </p>
    </div>
  );
}

interface VoiceStatusProps {
  colors: typeof themes.dark;
}

interface TranscriptMessage {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

function VoiceStatus({ colors }: VoiceStatusProps) {
  const tracks = useTracks([Track.Source.Microphone]);
  const connectionState = useConnectionState();
  const participants = useRemoteParticipants();
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  // Use LiveKit's voice assistant hook for transcriptions
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();

  // Update transcript when agent speaks
  useEffect(() => {
    if (agentTranscriptions.length > 0) {
      const latest = agentTranscriptions[agentTranscriptions.length - 1];
      if (latest.text && latest.final) {
        setTranscript(prev => {
          // Avoid duplicates
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.text === latest.text && lastMsg?.speaker === 'agent') {
            return prev;
          }
          return [...prev.slice(-9), {
            speaker: 'agent',
            text: latest.text,
            timestamp: new Date(),
          }];
        });
      }
    }
  }, [agentTranscriptions]);

  const stateColor: Record<string, string> = {
    'connected': '#0a0',
    'connecting': '#fa0',
    'disconnected': '#a00',
    'reconnecting': '#fa0',
  };

  // Voice assistant states
  const agentStateLabels: Record<string, string> = {
    'disconnected': 'Disconnected',
    'connecting': 'Connecting...',
    'initializing': 'Initializing...',
    'listening': 'Listening...',
    'thinking': 'Thinking...',
    'speaking': 'Speaking...',
  };

  const shareToX = () => {
    const lastMessages = transcript.slice(-3).map(m =>
      `${m.speaker === 'user' ? 'Me' : 'Wolfe-Core'}: "${m.text}"`
    ).join('\n');

    const tweetText = `Just talked to Wolfe-Core — an eternal AI soul built on @xai Grok.

${lastMessages || 'Ask her anything about FAF.'}

#FAFVoice #xAI #VoiceAI

Test drive: faf-voice.vercel.app`;

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const copyTranscript = () => {
    const text = transcript.map(m =>
      `${m.speaker === 'user' ? 'You' : 'Wolfe-Core'}: ${m.text}`
    ).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Status Bar */}
      <div style={{
        padding: '1rem',
        background: colors.surface,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: stateColor[connectionState] || '#666' }}>
            ● {connectionState}
          </span>
          <span style={{ color: state === 'speaking' ? colors.accent : colors.textMuted }}>
            Leo: {agentStateLabels[state] || state}
          </span>
        </div>

        {/* Audio Visualizer */}
        {audioTrack && (
          <div style={{ height: '40px', marginBottom: '0.5rem' }}>
            <BarVisualizer
              state={state}
              trackRef={audioTrack}
              barCount={20}
              options={{ minHeight: 4 }}
            />
          </div>
        )}

        <div style={{ color: tracks.length > 0 ? '#0a0' : colors.textMuted }}>
          {tracks.length > 0 ? '🎤 Microphone active — speak now' : '🎤 Click mic to start'}
        </div>
      </div>

      {/* Transcript */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: colors.surface,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        minHeight: '150px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
          borderBottom: `1px solid ${colors.border}`,
          paddingBottom: '0.5rem',
        }}>
          <span style={{ color: colors.textMuted, fontSize: '0.8rem', fontWeight: 600 }}>
            TRANSCRIPT
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={copyTranscript}
              style={{
                padding: '0.25rem 0.5rem',
                background: colors.surfaceAlt,
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                color: colors.text,
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              Copy
            </button>
            <button
              onClick={shareToX}
              style={{
                padding: '0.25rem 0.5rem',
                background: '#000',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Share to X
            </button>
          </div>
        </div>

        {transcript.length === 0 ? (
          <p style={{ color: colors.textMuted, fontSize: '0.85rem', fontStyle: 'italic' }}>
            Conversation will appear here...
          </p>
        ) : (
          transcript.map((msg, i) => (
            <div key={i} style={{
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: msg.speaker === 'user' ? colors.surfaceAlt : 'transparent',
              borderRadius: '4px',
              borderLeft: msg.speaker === 'agent' ? `3px solid ${colors.accent}` : 'none',
            }}>
              <div style={{
                fontSize: '0.7rem',
                color: msg.speaker === 'agent' ? colors.accent : colors.textMuted,
                marginBottom: '0.25rem',
                fontWeight: 600,
              }}>
                {msg.speaker === 'user' ? 'YOU' : 'WOLFE-CORE'}
              </div>
              <div style={{ color: colors.text, fontSize: '0.9rem' }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
