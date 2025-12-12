type Props = {
  params: { slug: string };
};

export default function CompanyPage({ params }: Props) {
  const name = params.slug.replace(/-/g, " ");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold capitalize mb-8">
        {name}
      </h1>

      <div className="space-y-8 text-sm text-neutral-700">
        <section>
          <h2 className="font-medium mb-2">Overview</h2>
          <p className="text-neutral-500">
            Company overview will appear here.
          </p>
        </section>

        <section>
          <h2 className="font-medium mb-2">Industry</h2>
          <p className="text-neutral-500">
            Industry classification coming soon.
          </p>
        </section>

        <section>
          <h2 className="font-medium mb-2">Signals</h2>
          <p className="text-neutral-500">
            Key signals and activity will appear here.
          </p>
        </section>

        <section>
          <h2 className="font-medium mb-2">People</h2>
          <p className="text-neutral-500">
            Key people associated with this company.
          </p>
        </section>

        <section>
          <h2 className="font-medium mb-2">Related Companies</h2>
          <p className="text-neutral-500">
            Similar companies will be suggested here.
          </p>
        </section>
      </div>
    </div>
  );
}
