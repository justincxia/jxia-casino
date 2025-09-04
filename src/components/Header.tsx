import { Coins, User as UserIcon, BadgeDollarSign } from "lucide-react";

interface HeaderProps {
    coins: number;
    isLoggedIn?: boolean;
    username?: string;
}

export default function Header({ coins, isLoggedIn = false, username }: HeaderProps) {
    return (
        <header style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(4px, 1vh, 12px) clamp(8px, 2vw, 16px)',
            backgroundColor: 'white',
            borderBottom: '1px solid #4b5563',
            height: 'clamp(60px, 8vh, 100px)',
            width: '98%'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'clamp(8px, 2vw, 20px)',
                flexShrink: 1
            }}>
                <BadgeDollarSign style={{
                    width: 'clamp(24px, 4vw, 48px)',
                    height: 'clamp(24px, 4vw, 48px)',
                    color: '#10b981'
                }} />
                <h1 style={{
                    fontSize: 'clamp(18px, 3vw, 36px)',
                    fontWeight: 'bold',
                    color: 'black',
                    margin: 0,
                    whiteSpace: 'nowrap'
                }}>jxia's casino</h1>
                {isLoggedIn && username && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'clamp(4px, 1vw, 8px)',
                        marginLeft: 'clamp(8px, 2vw, 16px)'
                    }}>
                        <UserIcon style={{
                            width: 'clamp(12px, 2vw, 20px)',
                            height: 'clamp(12px, 2vw, 20px)',
                            color: '#6b7280'
                        }} />
                        <span style={{
                            fontSize: 'clamp(10px, 1.5vw, 16px)',
                            color: '#6b7280',
                            fontWeight: '500'
                        }}>{username}</span>
                    </div>
                )}
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 'clamp(2px, 0.5vw, 6px)',
                backgroundColor: 'white',
                padding: 'clamp(2px, 0.5vh, 6px) clamp(8px, 2vw, 16px)',
                borderRadius: 'clamp(4px, 1vw, 12px)',
                flexShrink: 0,
                border: '1px solid #4b5563'
            }}>
                <Coins className="text-yellow-400" style={{
                    width: 'clamp(16px, 3vw, 32px)',
                    height: 'clamp(16px, 3vw, 32px)'
                }} />
                <span style={{
                    fontSize: 'clamp(14px, 2.5vw, 28px)',
                    fontWeight: '600',
                    color: 'black'
                }}>{coins}</span>
            </div>
        </header>
    );
}
