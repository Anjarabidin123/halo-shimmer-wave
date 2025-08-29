import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					secondary: 'hsl(var(--background-secondary))'
				},
				foreground: 'hsl(var(--foreground))',
				
				// Halo color system
				halo: {
					primary: 'hsl(var(--halo-primary))',
					secondary: 'hsl(var(--halo-secondary))',
					accent: 'hsl(var(--halo-accent))',
					warm: 'hsl(var(--halo-warm))'
				},
				
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					glass: 'hsl(var(--card-glass))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'halo-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(var(--halo-primary) / 0.5), 0 0 40px hsl(var(--halo-primary) / 0.3), 0 0 60px hsl(var(--halo-primary) / 0.1)'
					},
					'50%': {
						boxShadow: '0 0 30px hsl(var(--halo-primary) / 0.8), 0 0 60px hsl(var(--halo-primary) / 0.5), 0 0 90px hsl(var(--halo-primary) / 0.3)'
					}
				},
				'halo-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow-pulse': {
					'0%': { textShadow: '0 0 10px hsl(var(--halo-primary) / 0.7)' },
					'100%': { textShadow: '0 0 20px hsl(var(--halo-primary) / 0.9), 0 0 30px hsl(var(--halo-accent) / 0.5)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'halo-pulse': 'halo-pulse 3s ease-in-out infinite',
				'halo-rotate': 'halo-rotate 8s linear infinite',
				'float': 'float 4s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate'
			},
			backgroundImage: {
				'gradient-cosmic': 'var(--gradient-cosmic)',
				'gradient-aurora': 'var(--gradient-aurora)',
				'gradient-bg': 'var(--gradient-background)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
