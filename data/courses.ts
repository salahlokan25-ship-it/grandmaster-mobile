import { Course } from '../types/learning';

// Comprehensive course database for Strategos Chess Academy

export const courses: Course[] = [
    // ==================== OPENINGS ====================

    {
        id: 'sicilian-defense',
        title: 'The Sicilian Defense',
        shortDescription: 'Master the most popular fighting response to 1.e4',
        fullDescription: 'Learn the most critical opening for Black against 1.e4. From the Najdorf to the Dragon, understand the strategic ideas behind this asymmetrical opening.',
        category: 'openings',
        level: 'intermediate',
        coverImage: undefined,
        duration: 180,
        author: 'GM Elena Petrov',
        rating: 4.8,
        studentsEnrolled: 15420,
        lessons: [
            {
                id: 'sicilian-intro',
                courseId: 'sicilian-defense',
                orderIndex: 1,
                title: 'Introduction to the Sicilian',
                type: 'theory',
                content: {
                    text: `The Sicilian Defense (1.e4 c5) is Black's most popular and ambitious defense to 1.e4. Unlike 1...e5, the Sicilian creates an asymmetrical pawn structure that leads to unbalanced positions with chances for both sides.

**Key Ideas:**
- Fight for the center with ...c5
- Create queenside pawn majority
- Counter-attack on the queenside while White attacks on kingside
- Rich tactical possibilities

**Main Variations:**
1. Open Sicilian (2.Nf3 and 3.d4)
2. Closed Sicilian (2.Nc3)
3. Anti-Sicilians (Rossolimo, Moscow, Alapin)

Learning the Sicilian is essential for any serious chess player, as it's played in 25% of all games at the master level.`,
                    positions: [
                        {
                            fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
                            caption: 'The Sicilian Defense - Starting Position',
                            explanation: 'Black immediately challenges the center with the c-pawn.'
                        }
                    ]
                },
                estimatedTime: 15
            },
            {
                id: 'sicilian-najdorf',
                courseId: 'sicilian-defense',
                orderIndex: 2,
                title: 'The Najdorf Variation',
                type: 'theory',
                content: {
                    text: `The Najdorf (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6) is considered the sharpest and most complex variation of the Sicilian, favored by World Champions Fischer, Kasparov, and Anand.

**Strategic Goals:**
- Control d5 square
- Prepare ...e5 or ...e6
- Create queenside expansion with ...b5
- Flexible piece development

**White's Main Plans:**
1. English Attack (Be3, f3, Qd2, 0-0-0)
2. Classical (Be2, 0-0)
3. Poisoned Pawn (f4, Qf3)`,
                    positions: [
                        {
                            fen: 'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
                            caption: 'Najdorf Variation - Main Position',
                            explanation: 'The move ...a6 is the hallmark of the Najdorf, preparing queenside expansion.'
                        }
                    ]
                },
                estimatedTime: 25
            },
            {
                id: 'sicilian-dragon',
                courseId: 'sicilian-defense',
                orderIndex: 3,
                title: 'The Dragon Variation',
                type: 'theory',
                content: {
                    text: `The Dragon Variation (5...g6) is named for the pawn formation resembling a dragon. It's one of the most forcing variations in chess, leading to sharp tactical battles.

**Black's Plan:**
- Fianchetto the bishop on g7
- Pressure the long diagonal
- Create strong piece play
- Launch kingside counter-attack

**The Yugoslav Attack:**
White's most dangerous try, featuring opposite-side castling and a race to checkmate the opponent's king first. This leads to the sharpest positions in opening theory.`,
                    positions: [
                        {
                            fen: 'rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 6',
                            caption: 'Sicilian Dragon - Fianchetto Setup',
                            explanation: 'The Dragon bishop on g7 becomes a powerful attacking piece.'
                        }
                    ]
                },
                estimatedTime: 25
            }
        ]
    },

    {
        id: 'kings-indian-defense',
        title: 'King\'s Indian Defense',
        shortDescription: 'Dynamic aggressive defense against 1.d4',
        fullDescription: 'Master the fighting system preferred by legends like Fischer, Kasparov, and Tal. Learn how to create kingside attacks from seemingly passive positions.',
        category: 'openings',
        level: 'intermediate',
        duration: 165,
        author: 'GM David Bronstein',
        rating: 4.7,
        studentsEnrolled: 12300,
        lessons: [
            {
                id: 'kid-intro',
                courseId: 'kings-indian-defense',
                orderIndex: 1,
                title: 'King\'s Indian Basics',
                type: 'theory',
                content: {
                    text: `The King's Indian Defense (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7) is a hypermodern opening where Black allows White to build a large pawn center, planning to undermine and attack it later.

**Strategic Themes:**
- Fianchetto kingside bishop
- Allow White's pawn center (d4, e4, c4)
- Prepare central breaks with ...e5 or ...c5
- Create kingside pawn storms
- Dynamic piece play

**Main Systems:**
1. Classical Variation (7.Be2)
2. Samisch Variation (7.Be3)
3. Four Pawns Attack (7.f4)

The King's Indian produces rich, complex middlegames where both sides have clear plans and attacking chances.`,
                    positions: [
                        {
                            fen: 'rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP2BPPP/R1BQK1NR w KQ - 0 7',
                            caption: 'King\'s Indian Defense - Classical Setup',
                            explanation: 'Black has completed the fianchetto and castled kingside.'
                        }
                    ]
                },
                estimatedTime: 20
            },
            {
                id: 'kid-bayonet',
                courseId: 'kings-indian-defense',
                orderIndex: 2,
                title: 'The Bayonet Attack',
                type: 'theory',
                content: {
                    text: `The Bayonet Attack (g2-g4) is White's most aggressive try against the King's Indian. This sharp system aims to prevent Black's normal ...f5 break and create immediate threats on the kingside.

**White's Strategic Goals:**
- Control f5 square
- Prevent ...f5 break
- Create kingside space advantage
- Launch h-pawn storm

**Black's Counter-play:**
- Central break with ...c5
- Queenside expansion
- Piece pressure on White's extended kingside
- Tactical possibilities with ...Nh5

This leads to extremely sharp positions where both players attack on opposite wings.`,
                    positions: []
                },
                estimatedTime: 25
            }
        ]
    },

    {
        id: 'ruy-lopez',
        title: 'The Ruy Lopez',
        shortDescription: 'The classical approach to 1.e4',
        fullDescription: 'Study the "Spanish Opening" - one of the oldest and most respected openings in chess. Understand the deep strategic ideas behind this timeless system.',
        category: 'openings',
        level: 'advanced',
        duration: 210,
        author: 'GM Anatoly Karpov',
        rating: 4.9,
        studentsEnrolled: 18750,
        lessons: [
            {
                id: 'ruy-lopez-intro',
                courseId: 'ruy-lopez',
                orderIndex: 1,
                title: 'Introduction to the Spanish',
                type: 'theory',
                content: {
                    text: `The Ruy Lopez (1.e4 e5 2.Nf3 Nc6 3.Bb5) is named after 16th-century Spanish priest Ruy López de Segura. It's one of the most solid and strategically rich openings for White.

**White's Strategic Ideas:**
- Pressure Black's e5 pawn
- Control the center
- Maintain slight edge into the endgame
- Flexible piece development

**Main Defenses:**
1. Closed Variation (3...a6 4.Ba4 Nf6 5.O-O Be7)
2. Marshall Attack (8...d5 gambit)
3. Berlin Defense (3...Nf6)
4. Open Variation (5...Nxe4)

The Ruy Lopez has been tested for over 500 years and remains extremely popular at all levels.`,
                    positions: [
                        {
                            fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3',
                            caption: 'Ruy Lopez - Classical Position',
                            explanation: 'White\'s bishop on b5 puts immediate pressure on the c6 knight.'
                        }
                    ]
                },
                estimatedTime: 20
            }
        ]
    },

    // ==================== TACTICS ====================

    {
        id: 'fundamental-tactics',
        title: 'Fundamental Tactical Patterns',
        shortDescription: 'Master the essential tactical motifs',
        fullDescription: 'Learn to recognize and execute the basic tactical patterns that appear in every chess game. These fundamental skills are the foundation of tactical proficiency.',
        category: 'tactics',
        level: 'beginner',
        duration: 90,
        author: 'IM Sarah Johnson',
        rating: 4.9,
        studentsEnrolled: 45200,
        lessons: [
            {
                id: 'forks-pins',
                courseId: 'fundamental-tactics',
                orderIndex: 1,
                title: 'Forks and Pins',
                type: 'theory',
                content: {
                    text: `**Forks:**
A fork occurs when a single piece attacks two or more enemy pieces simultaneously. Knights are the most famous forking pieces, but all pieces can create forks.

**Common Fork Types:**
- Knight fork (family fork: king and queen)
- Pawn fork (attacking two pieces)
- Queen fork (multiple threats)

**Pins:**
A pin occurs when a piece cannot move without exposing a more valuable piece behind it. Pins come in two types:

- Absolute Pin: Pinned piece cannot legally move (exposes king)
- Relative Pin: Moving is legal but loses material

**How to Use Pins:**
1. Attack the pinned piece multiple times
2. Advance pawns to attack it
3. Break the pin tactically
4. Use it to win material or gain positional advantage`,
                    positions: [
                        {
                            fen: '4k3/5q2/8/3N4/4P3/8/4R3/4K3 w - - 0 1',
                            caption: 'Knight Fork Example',
                            explanation: 'The knight on d5 can fork the king and queen with Nf6+ or Nb6.'
                        }
                    ]
                },
                estimatedTime: 15
            },
            {
                id: 'discovered-attacks',
                courseId: 'fundamental-tactics',
                orderIndex: 2,
                title: 'Discovered Attacks',
                type: 'theory',
                content: {
                    text: `A discovered attack occurs when moving one piece uncovers an attack by another piece. This is one of the most powerful tactical weapons.

**Types:**
- Discovered check (most forcing)
- Discovered attack (on valuable piece)
- Double check (both pieces give check)

**Characteristics:**
- Piece that moves can make any threat
- Opponent must deal with the discovered attack
- Often wins material or delivers checkmate
- Double check = must move king

**How to Create Discovered Attacks:**
1. Position long-range piece (bishop, rook, queen)
2. Place another piece on the same line
3. Move the blocking piece with a threat
4. Opponent cannot parry both threats`,
                    positions: []
                },
                estimatedTime: 15
            }
        ]
    },

    {
        id: 'advanced-combinations',
        title: 'Advanced Tactical Combinations',
        shortDescription: 'Complex multi-move tactics and sacrifices',
        fullDescription: 'Study sophisticated tactical themes including deflection, decoy, clearance, and sacrificial combinations that win games at the highest level.',
        category: 'tactics',
        level: 'advanced',
        duration: 150,
        author: 'GM Mikhail Tal',
        rating: 4.8,
        studentsEnrolled: 8900,
        lessons: [
            {
                id: 'deflection-decoy',
                courseId: 'advanced-combinations',
                orderIndex: 1,
                title: 'Deflection and Decoy',
                type: 'theory',
                content: {
                    text: `**Deflection:**
Forcing an enemy piece to leave an important square or abandon a key defensive task.

**Decoy:**
Luring an enemy piece to a square where it can be trapped or where it interferes with the opponent's pieces.

**Deflection Examples:**
- Forcing a defender away from a key piece
- Removing a piece from a critical square
- Overloading a piece with too many defensive duties

**Decoy Techniques:**
- Sacrifice to lure king into danger
- Force piece to bad square
- Create tactical vulnerabilities
- Set up discovered attacks or forks

These are crucial tools for creating winning combinations.`,
                    positions: []
                },
                estimatedTime: 20
            }
        ]
    },

    // ==================== STRATEGY ====================

    {
        id: 'pawn-structures',
        title: 'Understanding Pawn Structures',
        shortDescription: 'The foundation of positional chess',
        fullDescription: 'Master the art of evaluating and playing different pawn structures. Learn typical plans and ideas for isolated pawns, pawn chains, passed pawns, and more.',
        category: 'strategy',
        level: 'intermediate',
        duration: 120,
        author: 'GM Tigran Petrosian',
        rating: 4.7,
        studentsEnrolled: 11400,
        lessons: [
            {
                id: 'isolated-queen-pawn',
                courseId: 'pawn-structures',
                orderIndex: 1,
                title: 'Isolated Queen Pawn (IQP)',
                type: 'theory',
                content: {
                    text: `The Isolated Queen's Pawn (IQP) appears frequently in many openings including the Queen's Gambit, French Defense, and Caro-Kann.

**Advantages of IQP:**
- Space advantage
- Active piece play
- Central control
- Pressure on d5/d4 square
- Weakens opponent's e7/e2 pawn

**Disadvantages:**
- Weak d-pawn (target for attack)
- Blocked by piece on d5/d4
- Weakness in the endgame
- Must be defended

**Plans for the Side WITH IQP:**
1. Create kingside attack
2. Use piece activity
3. Push d4-d5 breakthrough
4. Avoid piece trades

**Plans for the Side AGAINST IQP:**
1. Blockade with piece on d5/d4
2. Trade pieces toward endgame
3. Attack the isolated pawn
4. Prevent d4-d5 break`,
                    positions: [
                        {
                            fen: 'r1bq1rk1/pp1nbppp/2p1pn2/3p4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 1',
                            caption: 'Isolated Queen Pawn Structure',
                            explanation: 'White has an IQP on d4. Notice the space advantage and active pieces.'
                        }
                    ]
                },
                estimatedTime: 25
            },
            {
                id: 'pawn-chains',
                courseId: 'pawn-structures',
                orderIndex: 2,
                title: 'Pawn Chains and Blocked Centers',
                type: 'theory',
                content: {
                    text: `A pawn chain is a diagonal formation of pawns, each pawn protected by another. The French Defense and King's Indian Defense often feature pawn chains.

**Basic Principles (Nimzowitsch):**
1. Attack the base of the chain
2. Play on the side where you have space
3. Exchange pawns carefully
4. Blockade enemy pawn breaks

**Common Pawn Chain Structures:**
- French Defense (Black: d5-e6 vs White: e5-f4)
- King's Indian (White: c4-d5-e4 vs Black: e5-f7-g6)

**Strategic Considerations:**
- Side with more space attacks on that wing
- Cramped side plays on the other wing
- Piece placement crucial for defense/attack
- Pawn breaks define the middlegame plan`,
                    positions: []
                },
                estimatedTime: 25
            }
        ]
    },

    {
        id: 'prophylaxis',
        title: 'The Art of Prophylaxis',
        shortDescription: 'Preventing opponent\'s ideas',
        fullDescription: 'Learn advanced defensive and preventive thinking. Understand how to stop your opponent\'s plans before they happen - the hallmark of world champions.',
        category: 'strategy',
        level: 'advanced',
        duration: 100,
        author: 'GM Aaron Nimzowitsch',
        rating: 4.6,
        studentsEnrolled: 6200,
        lessons: [
            {
                id: 'prophylaxis-intro',
                courseId: 'prophylaxis',
                orderIndex: 1,
                title: 'Introduction to Prophylactic Thinking',
                type: 'theory',
                content: {
                    text: `Prophylaxis is the concept of making moves that prevent your opponent's ideas. Instead of only pursuing your own plans, you first neutralize the opponent's threats.

**Key Principles:**
1. Ask: "What does my opponent want to do?"
2. Prevent threatening moves before they happen
3. Control key squares and lines
4. Restrict opponent's piece activity

**Famous Examples:**
- Karpov's Boa Constrictor style
- Petrosian's prophylactic masterpieces
- Carlsen's prevention of counterplay

**When to Use Prophylaxis:**
- Opponent has concrete threats
- You have a slight advantage to maintain
- In technical positions
- After gaining material (prevent counterplay)

Mastering prophylaxis elevates your chess understanding to the master level.`,
                    positions: []
                },
                estimatedTime: 20
            }
        ]
    },

    // ==================== ENDGAMES ====================

    {
        id: 'essential-endgames',
        title: 'Essential Checkmate Patterns',
        shortDescription: 'Master the fundamental endgame checkmates',
        fullDescription: 'Learn the absolutely essential checkmates every chess player must know: king and pawn vs king, king and queen vs king, and basic piece checkmates.',
        category: 'endgame',
        level: 'beginner',
        duration: 75,
        author: 'GM José Capablanca',
        rating: 5.0,
        studentsEnrolled: 52000,
        lessons: [
            {
                id: 'king-pawn-vs-king',
                courseId: 'essential-endgames',
                orderIndex: 1,
                title: 'King and Pawn vs King',
                type: 'theory',
                content: {
                    text: `This is the most fundamental endgame position. Understanding the key concepts here is essential for all pawn endgames.

**The Opposition:**
Kings are in opposition when they face each other with one square between them. The player NOT to move has the opposition and usually wins.

**The Square Rule:**
A pawn can promote if the enemy king is outside the "square" formed by the pawn's current position and the promotion square.

**Critical Positions:**
1. King in front of pawn = usually wins
2. King next to pawn = check the opposition
3. Pawn on 5th rank = usually wins if supported
4. Pawn on 4th rank = needs proper technique

**Key Principles:**
- Get your king in front of your pawn
- Use opposition to infiltrate
- Avoid stalemate tricks
- Know when it's a theoretical draw`,
                    positions: [
                        {
                            fen: '8/8/8/4k3/4P3/4K3/8/8 w - - 0 1',
                            caption: 'King and Pawn Endgame',
                            explanation: 'White to move can win with proper technique using opposition.'
                        }
                    ]
                },
                estimatedTime: 20
            },
            {
                id: 'queen-king-checkmate',
                courseId: 'essential-endgames',
                orderIndex: 2,
                title: 'King and Queen vs King',
                type: 'practice',
                content: {
                    text: `Checkmating with king and queen against a lone king is an essential skill that must be automatic.

**Step-by-Step Method:**
1. Push enemy king to the edge of board
2. Use your queen to restrict the king
3. Bring your king closer for support
4. Deliver checkmate on the edge

**Common Mistakes to Avoid:**
- Giving stalemate (queen too close)
- Taking too many moves
- Allowing king to escape from edge

**Practice Goal:**
You should be able to deliver checkmate in 10 moves or less from any position.`,
                    positions: [
                        {
                            fen: '4k3/8/8/8/8/8/8/4K2Q w - - 0 1',
                            caption: 'Queen and King vs King - Practice Position',
                            explanation: 'White to move. Demonstrate the technique to checkmate.'
                        }
                    ]
                },
                estimatedTime: 15
            }
        ]
    },

    {
        id: 'rook-endgames',
        title: 'Rook Endgame Fundamentals',
        shortDescription: 'Master the most common endgame type',
        fullDescription: 'Rook endgames appear more often than any other. Learn the critical positions like Lucena and Philidor, and understand the principles that govern rook endings.',
        category: 'endgame',
        level: 'intermediate',
        duration: 135,
        author: 'GM Viktor Korchnoi',
        rating: 4.8,
        studentsEnrolled: 14500,
        lessons: [
            {
                id: 'lucena-position',
                courseId: 'rook-endgames',
                orderIndex: 1,
                title: 'The Lucena Position',
                type: 'theory',
                content: {
                    text: `The Lucena Position is the most important theoretical win in rook endgames. If you achieve this position, you can force a win.

**Winning Technique:**
1. Build a bridge with your rook
2. Block checks with the rook
3. King escapes from in front of pawn
4. Pawn promotes

**Key Characteristics:**
- Pawn on 7th rank
- Your king in front of pawn
- Opponent's king cut off by one file
- Your rook can build a bridge

**The Bridge-Building Technique:**
The winning method involves placing your rook on the 4th rank to block checks, allowing your king to escape and the pawn to promote.

Mastering Lucena is essential - it appears frequently in practical play.`,
                    positions: [
                        {
                            fen: '1K6/1P6/1k6/8/8/8/r7/R7 w - - 0 1',
                            caption: 'Lucena Position',
                            explanation: 'White wins with the bridge-building technique.'
                        }
                    ]
                },
                estimatedTime: 25
            },
            {
                id: 'philidor-position',
                courseId: 'rook-endgames',
                orderIndex: 2,
                title: 'The Philidor Defense',
                type: 'theory',
                content: {
                    text: `The Philidor Position is the fundamental defensive technique in rook and pawn endgames. Knowing this position can save many seemingly lost games.

**Defensive Setup:**
1. Place rook on 6th rank (3rd rank from defender's view)
2. Wait for pawn to advance to 6th rank
3. Give checks from the side
4. King oscillates on 8th rank

**Why This Works:**
- Rook on 6th rank prevents king advancement
- Once pawn advances, checks force king to block
- King blocking pawn = no progress
- Position is a theoretical draw

**When Philidor Fails:**
If the defending king is too far from the action or the rook isn't on the 6th rank when the pawn advances, the position may be lost.

This is a must-know defensive resource!`,
                    positions: []
                },
                estimatedTime: 25
            }
        ]
    },

    // ==================== RULES ====================

    {
        id: 'complete-chess-rules',
        title: 'Complete Chess Rules Encyclopedia',
        shortDescription: 'Everything you need to know about chess rules',
        fullDescription: 'A comprehensive guide to all chess rules, from basic piece movement to advanced regulations like en passant, castling rights, and tournament rules.',
        category: 'rules',
        level: 'beginner',
        duration: 60,
        author: 'FIDE Rules Commission',
        rating: 4.9,
        studentsEnrolled: 38000,
        lessons: [
            {
                id: 'piece-movement',
                courseId: 'complete-chess-rules',
                orderIndex: 1,
                title: 'How Pieces Move',
                type: 'theory',
                content: {
                    text: `**Pawn:**
- Moves forward one square
- First move: can move two squares
- Captures diagonally forward one square
- Promotes upon reaching 8th rank

**Knight:**
- Moves in "L" shape: two squares in one direction, one square perpendicular
- Only piece that can jump over others

**Bishop:**
- Moves diagonally any number of squares
- Each bishop stays on its starting color

**Rook:**
- Moves horizontally or vertically any number of squares
- Critical for castling

**Queen:**
- Combines rook and bishop movement
- Most powerful piece

**King:**
- Moves one square in any direction
- Most important piece (cannot be captured)
- Special move: castling`,
                    positions: []
                },
                estimatedTime: 15
            },
            {
                id: 'special-moves',
                courseId: 'complete-chess-rules',
                orderIndex: 2,
                title: 'Special Moves: Castling, En Passant, Promotion',
                type: 'theory',
                content: {
                    text: `**Castling:**
- King moves two squares toward rook
- Rook jumps over to other side of king
- Requirements: Neither piece has moved, squares between are empty, king not in check, castling squares not under attack

**En Passant:**
- When a pawn advances two squares from starting position
- If enemy pawn could have captured it had it moved one square
- Enemy pawn can capture "in passing"
- Must be done immediately on next move

**Pawn Promotion:**
- When pawn reaches 8th rank
- Must be promoted to Queen, Rook, Bishop, or Knight
- Usually promoted to Queen
- Can have multiple queens

**Check, Checkmate, Stalemate:**
- Check: King is under attack
- Checkmate: King is in check with no legal moves
- Stalemate: Player has no legal moves but king is not in check (draw)`,
                    positions: []
                },
                estimatedTime: 20
            }
        ]
    }
];

// Helper functions for course management

export function getCoursesByCategory(category: string): Course[] {
    return courses.filter(course => course.category === category);
}

export function getCourseById(id: string): Course | undefined {
    return courses.find(course => course.id === id);
}

export function getPopularCourses(limit: number = 5): Course[] {
    return [...courses]
        .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
        .slice(0, limit);
}

export function getCoursesByLevel(level: string): Course[] {
    return courses.filter(course => course.level === level);
}
