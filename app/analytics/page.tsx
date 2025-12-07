"use client";

import { useProducts } from "@/hooks/useProducts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, Cell } from "recharts";

export default function AnalyticsPage() {
  const products = useProducts();
  const last10Products = products.slice(-10);

  const stockChartData = Array.from({ length: 10 }).map((_, i) => {
    const product = last10Products[i - (10 - last10Products.length)];
    return product
      ? { name: product.name, stock: product.quantity }
      : { name: "", stock: 0 };
  });

  if (!products) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  const stockChartConfig = {
    stock: {
      label: "Stock Quantity",
      color: "#4f46e5",
    },
  } satisfies ChartConfig;

  const statusChartData = [
    { status: "Active", count: products.filter((p) => p.status).length },
    { status: "Inactive", count: products.filter((p) => !p.status).length },
  ];

  const statusChartConfig = {
    count: {
      label: "Products",
      color: "#4f46e5",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-8">
      <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold text-gray-100">
        Product Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border border-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle>Stock Quantity per Product</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer config={stockChartConfig} className="w-full h-full">
              <BarChart data={stockChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="stock" radius={4}>
                  {stockChartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill="var(--color-stock)"
                      onMouseOver={(e) =>
                        (e.target as SVGRectElement).setAttribute(
                          "fill",
                          "#6366f1"
                        )
                      }
                      onMouseOut={(e) =>
                        (e.target as SVGRectElement).setAttribute(
                          "fill",
                          "var(--color-stock)"
                        )
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border border-gray-700 rounded-xl">
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={statusChartConfig}
              className="w-full h-full"
            >
              <BarChart data={statusChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
