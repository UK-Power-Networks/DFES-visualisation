#!/usr/bin/perl
# Convert a TSV file into "DNO":["MSOA1","MSOA2","MSOA3"...]

open(FILE,$ARGV[0]||"DNOlookup.tsv");
@lines = <FILE>;
close(FILE);

$areahead = $ARGV[1]||"Licence area";
$msoahead = $ARGV[2]||"MSOA11CD";

%areas;

for($l = 0; $l < @lines; $l++){
	@cols = split(/\t/,$lines[$l]);
	if($l == 0){
		@header = @cols;
		for($c = 0; $c < @header; $c++){
			if($header[$c] eq $areahead){ $areacol = $c; }
			if($header[$c] eq $msoahead){ $msoacol = $c; }
		}
	}else{
		$area = $cols[$areacol];
		if($areas{$area}){ $areas{$area} .= ","; }
		$areas{$area} .= "\"$cols[$msoacol]\"";
	}
}

print "{\n";
$i = 0;
foreach $area (sort(keys(%areas))){
	if($i > 0){ print ",\n"; }
	print "\t\"$area\":[$areas{$area}]";
	$i++;
}
print "\n}\n";