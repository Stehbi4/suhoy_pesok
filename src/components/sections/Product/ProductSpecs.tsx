const ProductSpecs = ({ product }: { product: any }) => (
  <section className="py-16 md:py-24 bg-[#111111]">
    <div className="container-custom">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-px bg-white" />
        <span className="uppercase tracking-widest text-sm text-white/70">Технические характеристики</span>
      </div>

      {product.technicalData && (
        <div className="overflow-x-auto border border-[#222222] rounded-2xl">
          <table className="w-full text-white">
            <tbody className="divide-y divide-[#222222]">
              {Object.entries(product.technicalData).map(([key, value]) => (
                <tr key={key} className="hover:bg-[#1a1a1a]">
                  <td className="px-8 py-5 text-gray-400 w-1/2">{key}</td>
                  <td className="px-8 py-5 font-light">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
);

export default ProductSpecs;