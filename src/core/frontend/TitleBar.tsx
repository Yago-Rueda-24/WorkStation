import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

interface MenuItem {
    label: string;
    onClick?: () => void;
    shortcut?: string;
    danger?: boolean;
}

interface MenuSection {
    id: string;
    label: string;
    items: MenuItem[];
}

const TitleBar: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const menus: MenuSection[] = [
        {
            id: 'file',
            label: 'File',
            items: [
                { label: 'Exit', danger: true, onClick: () => window.close() }
            ]
        },
        {
            id: 'view',
            label: 'View',
            items: [
                { label: 'Dashboard', onClick: () => navigate('/dashboard') },
                { label: 'Tasks', onClick: () => navigate('/tasks') },
                { label: 'Settings', onClick: () => navigate('/settings') },
            ]
        },
        {
            id: 'edit',
            label: 'Edit',
            items: [
                { label: 'Undo', shortcut: 'Ctrl+Z' },
                { label: 'Redo', shortcut: 'Ctrl+Y' },
                { label: 'Cut', shortcut: 'Ctrl+X' },
                { label: 'Copy', shortcut: 'Ctrl+C' },
                { label: 'Paste', shortcut: 'Ctrl+V' }
            ]
        },
        {
            id: 'help',
            label: 'Help',
            items: [
                { label: 'Documentation' },
                { label: 'Release Notes' },
                { label: 'About' }
            ]
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (menuId: string) => {
        setOpenMenu(openMenu === menuId ? null : menuId);
    };

    const handleMouseEnter = (menuId: string) => {
        if (openMenu !== null) {
            setOpenMenu(menuId);
        }
    };

    return (
        <div className="h-[35px] bg-[#0f172a] flex items-center fixed top-0 left-0 right-0 z-[1000] text-[#94a3b8] select-none border-b border-white/5">
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}></div>
            <div className="flex items-center pl-3 h-full z-[1001]">
                <div className="flex items-center mr-4" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                    <img src="electron-vite.svg" alt="App Icon" className="w-4 h-4 mr-2" />
                </div>
                <nav ref={navRef} className="flex gap-1 h-full items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                    {menus.map((menu) => (
                        <div key={menu.id} className="relative h-full flex items-center">
                            <button
                                onClick={() => toggleMenu(menu.id)}
                                onMouseEnter={() => handleMouseEnter(menu.id)}
                                className={`
                                    bg-transparent border-none text-inherit text-xs py-1 px-2 rounded hover:bg-white/10 cursor-pointer transition-colors
                                    ${openMenu === menu.id ? 'bg-white/10 text-white' : ''}
                                `}
                            >
                                {menu.label}
                            </button>

                            {openMenu === menu.id && (
                                <div className="absolute top-[35px] left-0 w-56 bg-[#1e293b] border border-white/10 rounded-md shadow-2xl py-1.5 z-50 flex flex-col">
                                    {menu.items.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                item.onClick?.();
                                                setOpenMenu(null);
                                            }}
                                            className={`
                                                w-full text-left px-4 py-1.5 text-xs flex justify-between items-center transition-colors
                                                ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-[#e2e8f0] hover:bg-teal-500/20'}
                                            `}
                                        >
                                            <span>{item.label}</span>
                                            {item.shortcut && (
                                                <span className="text-[10px] text-[#94a3b8] ml-4">{item.shortcut}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default TitleBar;
