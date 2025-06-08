type Override<Original, Overrider extends { [key in keyof Original]?: Overrider[key] }> = Omit<Original, keyof Overrider> & Overrider;

export default Override;
