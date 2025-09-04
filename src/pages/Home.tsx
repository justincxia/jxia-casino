import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface HomeProps {
    coins: number;
    isLoggedIn: boolean;
    username: string;
}

export default function Home({ coins, isLoggedIn, username }: HomeProps) {
    const navigate = useNavigate();

    const handleGameClick = (gamePath: string) => {
        navigate(gamePath);
    };
    return (
        <div className="flex flex-col w-full">
            <Header coins={coins} isLoggedIn={isLoggedIn} username={username} />

            <main className="flex-1 text-center" style={{
                padding: 'clamp(16px, 4vw, 48px)'
            }}>
                <div>
                    <h1 className="text-xl font-bold mb-2">
                        Home
                    </h1>
                </div>
                <div>
                    <Link to="/login">
                        {isLoggedIn ? 'Account Settings' : 'Login / Register'}
                    </Link>
                </div>
                <div>
                    <div onClick={() => handleGameClick('/mines')} style={{ color: 'blue' }}>
                        Mines (game) (click me)
                    </div>
                </div>
            </main>
        </div>
    );
}
