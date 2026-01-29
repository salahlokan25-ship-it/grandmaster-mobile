import * as Speech from 'expo-speech';

export const speakMove = (notation: string, isSpeechEnabled: boolean) => {
    if (!isSpeechEnabled) return;

    // Convert notation like "e2-e4" or "Nf3" to readable text
    let text = notation;

    // Simple mapping for common notation
    text = text.replace('x', ' takes ');
    text = text.replace('-', ' to ');
    text = text.replace('N', 'Knight ');
    text = text.replace('B', 'Bishop ');
    text = text.replace('R', 'Rook ');
    text = text.replace('Q', 'Queen ');
    text = text.replace('K', 'King ');
    text = text.replace('#', ' checkmate');
    text = text.replace('+', ' check');
    text = text.replace('=Q', ' promotes to Queen');

    Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
    });
};

export const speakMessage = (message: string, isSpeechEnabled: boolean) => {
    if (!isSpeechEnabled) return;
    Speech.speak(message, {
        language: 'en',
        pitch: 1.1,
        rate: 0.95,
    });
};
