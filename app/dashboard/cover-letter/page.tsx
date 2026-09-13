import CoverLetterWizard from "../dashComponents/CoverLetterAdmin";

export default function CoverLetterOptimizationPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-white">
        Cover Letter Optimization
      </h1>

      <div className="mt-6">
        <CoverLetterWizard />
      </div>
    </>
  );
}