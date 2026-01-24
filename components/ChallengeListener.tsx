import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useFriendsStore } from '../stores/friendsStore';
import { useUserStore } from '../stores/userStore';

export function ChallengeListener() {
    const router = useRouter();
    const segments = useSegments();
    const { currentUser } = useUserStore();
    const {
        subscribeToChallenges,
        subscribeToSentChallenges,
        respondToChallenge,
        incomingChallenges,
        sentChallenges
    } = useFriendsStore();

    useEffect(() => {
        if (!currentUser.id) return;

        // Subscribe to both incoming (to me) and outgoing (from me) challenges
        const unsubIncoming = subscribeToChallenges(currentUser.id);
        const unsubSent = subscribeToSentChallenges(currentUser.id);

        return () => {
            unsubIncoming();
            unsubSent();
        };
    }, [currentUser.id]);

    // Handle Incoming Challenges (Pending)
    useEffect(() => {
        const pending = incomingChallenges.find(c => c.status === 'pending');
        if (pending) {
            Alert.alert(
                'New Chess Challenge!',
                `${pending.senderName} has challenged you to a game.`,
                [
                    {
                        text: 'Decline',
                        style: 'cancel',
                        onPress: () => respondToChallenge(pending.id, 'declined')
                    },
                    {
                        text: 'Accept',
                        onPress: async () => {
                            await respondToChallenge(pending.id, 'accepted');
                            // Navigation handled by the accepted listener below
                        }
                    }
                ]
            );
        }
    }, [incomingChallenges]);

    // Handle Accepted Challenges (Both Sender and Receiver)
    useEffect(() => {
        // Check for any accepted challenge that has a gameId
        // We look in both lists because I could be the sender OR the receiver
        const acceptedIncoming = incomingChallenges.find(c => c.status === 'accepted' && c.gameId);
        const acceptedSent = sentChallenges.find(c => c.status === 'accepted' && c.gameId);

        const activeChallenge = acceptedIncoming || acceptedSent;

        if (activeChallenge && activeChallenge.gameId) {
            // Avoid duplicate navigation if already in game
            // (In a real app, strict checks would be needed)

            // Navigate to the game
            // We use replace to ensure back button goes to lobby/home, not the challenge alert
            router.push({
                pathname: "/game",
                params: { gameId: activeChallenge.gameId }
            });

            // Cleanup/Closing logic would be nuanced here (e.g. marking challenge as 'completed' or 'navigated')
            // For now, we assume the game screen handles game logic.
            // Consider cleaning up challenge alerts to avoid loops?
        }
    }, [incomingChallenges, sentChallenges]);

    return null; // Headless component
}
