interface StepHeaderProps {
  stepNumber: number;
  title: string;
  subtitle: string;
}

export function StepHeader({ stepNumber, title, subtitle }: StepHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-bermuda-500 to-bermuda-600 text-white rounded-full text-xl font-bold mb-4 shadow-lg">
        {stepNumber}
      </div>
      <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-bermuda-700 via-bermuda-600 to-bermuda-500 bg-clip-text text-transparent p-3">
        {title}
      </h2>
      <p className="text-xl text-bermuda-600 font-medium max-w-3xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
