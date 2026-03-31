'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import api from '@/lib/axios';
import {
    FiArrowLeft, FiMic, FiMicOff, FiVideo, FiVideoOff,
    FiPhoneOff, FiClock, FiArrowRight, FiAlertCircle,
} from 'react-icons/fi';
import { FaVideo } from 'react-icons/fa6';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

type Phase = 'checking' | 'waiting' | 'joining' | 'in-call' | 'ended' | 'expired' | 'error';

export default function CustomerVideoCallPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const appointmentId = params?.id;
    const { socket } = useSocket();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [phase, setPhase] = useState<Phase>('checking');
    const [micMuted, setMicMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // ── Create PC ─────────────────────────────────────────────────────────────
    const createPC = useCallback(() => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        pc.onicecandidate = ({ candidate }) => {
            if (candidate) {
                socket.emit('video:signal', {
                    type: 'candidate',
                    candidate: candidate.candidate,
                    sdpMid: candidate.sdpMid,
                    sdpMLineIndex: candidate.sdpMLineIndex,
                });
            }
        };

        pc.ontrack = ({ streams }) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = streams[0];
            setPhase('in-call');
        };

        pc.onconnectionstatechange = () => {
            if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
                setPhase('ended');
            }
        };

        return pc;
    }, [socket]);

    // ── Join session ──────────────────────────────────────────────────────────
    const joinSession = useCallback(async (token: string) => {
        try {
            setPhase('joining');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const pc = createPC();
            pcRef.current = pc;
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            socket.emit('video:join', { token });
        } catch (err: any) {
            setErrorMsg(err.message || 'Could not access camera/mic');
            setPhase('error');
        }
    }, [socket, createPC]);

    // ── Signal handler ────────────────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        const handleSignal = async ({ type, sdp, candidate, sdpMid, sdpMLineIndex }: any) => {
            const pc = pcRef.current;
            if (!pc) return;
            if (type === 'offer') {
                await pc.setRemoteDescription({ type: 'offer', sdp });
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('video:signal', { type: 'answer', sdp: answer.sdp });
            }
            if (type === 'candidate') {
                try { await pc.addIceCandidate({ candidate, sdpMid, sdpMLineIndex }); } catch { }
            }
        };

        socket.on('video:signal', handleSignal);
        socket.on('video:ended', () => setPhase('ended'));
        socket.on('video:peer-left', () => setPhase('ended'));
        socket.on('video:error', ({ message }: { message: string }) => { setErrorMsg(message); setPhase('error'); });

        return () => {
            socket.off('video:signal', handleSignal);
            socket.off('video:ended');
            socket.off('video:peer-left');
            socket.off('video:error');
        };
    }, [socket]);

    // ── Initial check ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!appointmentId || !socket) return;

        const checkAndJoin = async () => {
            try {
                const res = await api.get(`/doctors/appointments/${appointmentId}/video/join`);
                const data = res.data.data;

                if (data.status === 'ACTIVE') {
                    await joinSession(data.token);
                } else if (data.status === 'WAITING') {
                    setPhase('waiting');

                    const handleDoctorStarted = async ({ appointmentId: id }: { appointmentId: string }) => {
                        if (id !== appointmentId) return;
                        const joinRes = await api.get(`/doctors/appointments/${appointmentId}/video/join`);
                        const joinData = joinRes.data.data;
                        if (joinData.status === 'ACTIVE') {
                            socket.off('video:doctor-started', handleDoctorStarted);
                            await joinSession(joinData.token);
                        }
                    };

                    socket.on('video:doctor-started', handleDoctorStarted);
                }
            } catch (err: any) {
                if (err.response?.status === 410) {
                    setPhase('expired');
                } else {
                    setErrorMsg(err.response?.data?.message || 'Something went wrong');
                    setPhase('error');
                }
            }
        };

        checkAndJoin();
    }, [appointmentId, socket, joinSession]);

    // ── Hang up ───────────────────────────────────────────────────────────────
    const hangUp = async () => {
        try { await api.post(`/doctors/appointments/${appointmentId}/video/end`); } catch { }
        pcRef.current?.close();
        pcRef.current = null;
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        socket.emit('video:leave');
        socket.off('video:signal');
        socket.off('video:create-offer');
        socket.off('video:peer-joined');
        socket.off('video:peer-left');
        setPhase('ended');
        router.back();
    };

    const toggleMic = () => {
        localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
        setMicMuted(m => !m);
    };

    const toggleCam = () => {
        localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
        setCamOff(c => !c);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900/80 backdrop-blur border-b border-slate-800">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
                >
                    <FiArrowLeft size={16} /> Back
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">Consultation</span>
                </div>

                <div className="w-16" />
            </div>

            {/* Video Area */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">

                <video
                    ref={remoteVideoRef}
                    autoPlay playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${phase === 'in-call' ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* checking */}
                {phase === 'checking' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <p className="text-slate-400 text-sm">Checking session status…</p>
                    </div>
                )}

                {/* waiting */}
                {phase === 'waiting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute w-28 h-28 rounded-full bg-primary/10 animate-ping" />
                            <span className="absolute w-20 h-20 rounded-full bg-primary/20 animate-ping" style={{ animationDelay: '0.3s' }} />
                            <div className="relative w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <FaVideo className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">Waiting for Doctor</p>
                            <p className="text-slate-400 text-sm mt-1">You'll be connected automatically when the doctor starts</p>
                        </div>
                        <div className="flex gap-1.5 items-center">
                            {[0, 1, 2].map(i => (
                                <span key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    </div>
                )}

                {/* joining */}
                {phase === 'joining' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <video ref={localVideoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 scale-x-[-1]" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            <div className="bg-slate-900/80 backdrop-blur rounded-2xl px-6 py-4 text-center">
                                <p className="text-white font-bold">Connecting…</p>
                                <p className="text-slate-400 text-sm mt-1">Setting up your video call</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ended */}
                {phase === 'ended' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">

                        <div className="text-center">
                            <p className="text-white text-xl font-bold">Call Ended</p>
                        </div>
                        <button onClick={() => router.back()} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold transition">
                            Back to Appointment
                        </button>
                    </div>
                )}

                {/* expired */}
                {phase === 'expired' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                        <div className="w-20 h-20 rounded-3xl bg-amber-900/30 flex items-center justify-center">
                            <FiClock className="text-amber-500" size={36} />
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">Session Expired</p>
                            <p className="text-slate-400 text-sm mt-2 max-w-xs">This appointment's video session has expired. Please contact your doctor.</p>
                        </div>
                        <button onClick={() => router.back()} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold transition">
                            Go Back
                        </button>
                    </div>
                )}

                {/* error */}
                {phase === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                        <div className="w-20 h-20 rounded-3xl bg-red-900/30 flex items-center justify-center">
                            <FiAlertCircle className="text-red-400" size={36} />
                        </div>
                        <div className="text-center">
                            <p className="text-white text-xl font-bold">Something went wrong</p>
                            <p className="text-slate-400 text-sm mt-2 max-w-xs">{errorMsg || 'Could not connect to the video session.'}</p>
                        </div>
                        <button onClick={() => router.back()} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl font-semibold transition">
                            Go Back
                        </button>
                    </div>
                )}


                {/* Local PiP */}
                {(phase === 'in-call' || phase === 'joining') && (
                    <div className="absolute bottom-28 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                        <video
                            ref={localVideoRef}
                            autoPlay muted playsInline
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                        {camOff && (
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                <FiVideoOff className="text-slate-400" size={20} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Controls */}
            {phase === 'in-call' && (
                <div className="flex items-center justify-center gap-4 py-5 bg-slate-900 border-t border-slate-800">
                    <button
                        onClick={toggleMic}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${micMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                        {micMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
                    </button>

                    <button
                        onClick={hangUp}
                        className="w-16 h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg shadow-red-900/30"
                    >
                        <FiPhoneOff size={22} />
                    </button>

                    <button
                        onClick={toggleCam}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${camOff ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                        {camOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
                    </button>
                </div>
            )}
        </div>
    );
}